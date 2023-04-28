---
---

// Create a currency number formatter.
var currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

class Item {
  constructor(sku, description, price, allow_multiple, stripe_id) {
    this.sku = sku;
    this.description = description;
    this.price = price;
    this.allow_multiple = allow_multiple;
    this.stripe_id = stripe_id;
  }
}

class Batch {
  constructor(sku, quantity) {
    this.sku = sku
    this.quantity = quantity
  }
}

class Cart {
  constructor() {
    let contents = localStorage.getItem('cart_contents')
    if (contents) {
      let parsed = JSON.parse(contents)
      this.batches = parsed.map(item => new Batch(item.sku, item.quantity))
    } else {
      this.batches = []
    }
  }

  save() {
    localStorage.setItem('cart_contents', JSON.stringify(this.batches))
  }

  items() {
    return this.batches.map(batch => {
      return {
        item: inventory.get_item(batch.sku),
        quantity: batch.quantity
      }
    })
  }

  num_items() {
    return this.batches.length
  }

  total() {
    return this.items().reduce(
      (acc, batch) => acc + (batch.item.price * batch.quantity),
      0
    )
  }

  add_item(sku) {
    let existing_batch = this.batches.find(batch => batch.sku == sku)
    if (existing_batch == undefined) {
      this.batches.push({ sku: sku, quantity: 1 })
    } else {
      existing_batch.quantity += 1
    }
    this.save()
  }

  remove_item(item) {
    let idx = this.batches.findIndex(batch => batch.sku == item.sku)
    if (idx > -1) {
      this.batches.splice(idx, 1)
    }
    this.save()
  }

  decrement_qty(sku) {
    let existing_batch = this.batches.find(batch => batch.sku == sku)
    if (existing_batch != undefined) {
      if (existing_batch.quantity >= 2) {
        existing_batch.quantity -= 1
      } else if (existing_batch.quantity == 1) {
        this.remove_from_cart(item)
      }
    }
    this.save()
  }
}

class Inventory {
  constructor() {
    this.items = {}
  }

  add_item(sku, description, price, allow_multiple, stripe_id) {
    this.items[sku] = new Item(sku, description, price, allow_multiple, stripe_id)
  }

  get_item(sku) {
    return this.items[sku]
  }
}

let inventory = new Inventory()
{% for item in site.data.inventory %}
inventory.add_item(
  "{{ item['sku'] }}",
  "{{ item['description'] }}",
  {{ item['price'] }},
  "{{ item['allow_multiple'] }}" === "true",
{%- if site.data.stripe.mode == "test" %}
  "{{ item['stripe_id_test'] }}"
{%- else %}
  "{{ item['stripe_id_live'] }}"
{%- endif %}
)
{% endfor %}

let processing_fee_items = []
processing_fee_items.unshift(
{%- for item in site.data.processing_fees %}
  {
    amount: {{item['amount']}},
    {%- if site.data.stripe.mode == "test" %}
    stripe_id: "{{ item['stripe_id_test'] }}"
    {%- else %}
    stripe_id: "{{ item['stripe_id_live'] }}"
    {%- endif %}
  },
{%- endfor %}
)
processing_fee_items.reverse()

function calculate_fee(subtotal) {
  let fixed_fee = 0.3
  let percent_fee = .029
  let total = (subtotal + fixed_fee) / (1 - percent_fee)
  return total - subtotal
}

function get_processing_fee_item(amount) {
  let fee = calculate_fee(amount)
  let item = processing_fee_items.find(item => item.amount <= fee);
  if (item) {
    return new Item("stripe_processing_fee", "Stripe Processing Fee", item.amount, false, item.stripe_id);
  } else {
    return new Item("stripe_processing_fee", "Stripe Processing Fee", 0, false, null);
  }
}

var stripe = Stripe('{{ site.data.stripe.api_key[site.data.stripe.mode] }}');
