# Pullable Event Bus

A minimal event bus where emmiters can pull data from subscribers

1. Install it with: `npm i --save pullable-event-bus` or `yarn add pullable-event-bus`
2. Import it:
```javascript
// ES6
import { makeEventBus } from 'pullable-event-bus'
// Node.js
const { makeEventBus } = require('pullable-event-bus')
```
3. Use it:
```javascript
const eventBus = makeEventBus()
// subscribers
eventBus.on('channel', data => console.log(data))
eventBus.on('channel', data => data + 1, true) // true means is a pullable subscriber
// emit a message
eventBus.emit('channel', 10).then(results => console.log(results))
// logs:
// 10 from first subscriber
// [11] as the result of emitting the message and the '11' comes from the second (the pullable) subscriber
```

Have fun!
