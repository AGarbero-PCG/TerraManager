// src/assets/icons.js
/* Import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';

/* Import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* Import specific icons */
import { faEdit, faTrash, faUserPlus, faCirclePlus, faHome, faSquarePlus } from '@fortawesome/free-solid-svg-icons';

/* Add icons to the library */
library.add(faEdit, faTrash, faUserPlus, faCirclePlus, faHome, faSquarePlus);

export { FontAwesomeIcon };
