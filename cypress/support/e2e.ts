// Loaded before every spec: custom commands and the tag filter (@cypress/grep).
import { register as registerGrep } from '@cypress/grep';
import './commands';

registerGrep();
