class ExpandingList extends HTMLUListElement {
   constructor() {
      super();

      const uls = Array.from(this.querySelectorAll('ul'));
      const lis = Array.from(this.querySelectorAll('li'));

      // Hide all child uls
      // These lists will be shown when the user clicks a higher level container
      uls.forEach((ul) => {
         ul.style.display = 'none';
      });

      lis.forEach((li) => {
         // If this li has a ul as a child, decorate it and add a click handler
         if (li.querySelectorAll('ul').length > 0) {
            // Add an attribute which can be used by the style
            // to show an open or closed icon
            li.setAttribute('class', 'closed');

            const childText = li.childNodes[0];
            const newSpan = document.createElement('span');

            // Copy text from li to span, set cursor style
            newSpan.textContent = childText.textContent;
            newSpan.style.cursor = 'pointer';

            // Add click handler to this span
            newSpan.onclick = this.showul;

            // Add the span and remove the bare text node from the li
            childText.parentNode.insertBefore(newSpan, childText);
            childText.parentNode.removeChild(childText);
         }
      });
   }

   showul(e) {
      const nextul = e.target.nextElementSibling;

      // Toggle visible state and update class attribute on ul
      if (nextul.style.display == 'block') {
         nextul.style.display = 'none';
         nextul.parentNode.setAttribute('class', 'closed');
      } else {
         nextul.style.display = 'block';
         nextul.parentNode.setAttribute('class', 'open');
      }
   }
}

// Define the new element
customElements.define('expanding-list', ExpandingList, { extends: 'ul' });
