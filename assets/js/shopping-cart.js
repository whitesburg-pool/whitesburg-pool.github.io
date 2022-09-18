// Create a currency number formatter.
var currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

stripe_mode = "test"

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
if (stripe_mode == "test") {
  inventory.add_item("family_dues", "Family Dues", 515, false, "price_1LjESCK2rE6HoVznq9ZED3kf")
  inventory.add_item("late_fee_2", "Late Fee (After June 1st)", 150, false, "price_1LjEShK2rE6HoVznK0HnZojC")
} else {
  inventory.add_item("membership", "Membership", 50, false, "price_1LjE1dK2rE6HoVznsnc6Qsyj")
  inventory.add_item("trial_membership", "Trial Membership", 315, false, "price_1LjE2UK2rE6HoVzn2feooFs9")
  inventory.add_item('individual_dues', "Individual Dues", 315, false, "price_1LjE3CK2rE6HoVznNRT9SMG5")
  inventory.add_item("couples_dues", "Couples Dues", 415, false, "price_1LjE3RK2rE6HoVznU67H7Vqu")
  inventory.add_item("family_dues", "Family Dues", 515, false, "price_1LjE3pK2rE6HoVznm6wz48XU")
  inventory.add_item("late_fee_1", "Late Fee (After May 10th)", 50, false, "price_1LjE4JK2rE6HoVznir5Cwg58")
  inventory.add_item("late_fee_2", "Late Fee (After June 1st)", 150, false, "price_1LjE4ZK2rE6HoVznQAZFio9j")
  inventory.add_item("swim_dive_membership", "Swim & Dive Team Membership", 150, false, "")
  inventory.add_item("dive_membership", "Dive Team Membership", 50, false, "")
}

var stripe = undefined
if (stripe_mode == "test") {
  stripe = Stripe('pk_test_51LgusSK2rE6HoVznfrpgCZYAO0LwhUISI7MqloELUybUuBi4bo1DeNsokRnhehxYcBKcGLEiWdGvOLnShBYvT2bt005rugvSnh');
}