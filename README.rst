---------------
Whitesburg Pool
---------------

This repository contains the source code for the Whitesburg Pool website (currently
http://www.whitesburgpool.org).

Development
===========

This site is built using the static site generator jekyll_. This allows us to get some nice features like
templating_ and less_ support without having to use a dynamic backend.

.. _jekyll: https://jekyllrb.com/
.. _templating: https://jekyllrb.com/docs/templates/
.. _less: http://lesscss.org/

When working with Jekyll, you edit files and then run ``jekyll build`` to generate the site, which
will be generated under the ``_site`` directory. There is also a Makefile which provides a target
``generate`` which does the same thing.

While developing, it's nice to view your page while you make changes before uploading them to the
server. With Jekyll, just run ``jekyll serve`` from the root directory project and then open
http://localhost:4000/ in your browser. You should see your page running in a little debug web
server. The server will automatically reload when you save files, so all you have to do is refresh
the page in the browser to see your changes.

To publish, the generated ``_site`` directory needs to be uploaded via FTP to
ftp.whitesburgpool.org. A make target exists which will sync the folder appropriately. It uses
``lftp`` which can easily be installed on most Linux distributions via the standard repos. It should
also be available for MacOS (via Homebrew) and Windows (via Cygwin). Alternately, you could just use
your favorite FTP client.

Acknowledgements
================

This version of the site was created by Nathan Alderson:

    **Email:** nathan.alderson@gmail.com
    **Web:** https://nathanalderson.com
    **Twitter:** `@nathanalderson <https://twitter.com/nathanalderson>`_

The website template was adapted from:

    Twenty by HTML5 UP
    html5up.net | @ajlkn
    Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)

See TWENTY.txt for more information and TWENTY-LICENSE.txt for a full copy of the license. Files
originally from Twenty are generally indicated by a comment or header in the file (where possible).

We also use `Font Awesome`_ icons pretty heavily throughout the site.

.. _Font Awesome: https://fontawesome.com/

License and Copyright
=====================

All content is copyright Whitesburg Recreation Association.

Website design is licensed under the CCA 3.0 license.

