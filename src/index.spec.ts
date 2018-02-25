import test from 'ava'
import { makeEventBus } from '.'

test('An event should be broadcasted to subscribers', async t => {
  const eventBus = makeEventBus()
  const channel1 = []
  const channel2 = []
  eventBus.on('channel1', data => channel1.push([1, data]))
  eventBus.on('channel1', data => channel1.push([2, data]))
  eventBus.on('channel2', data => channel2.push([1, data]))
  eventBus.on('channel2', data => channel2.push([2, data]))
  await eventBus.emit('channel1', 'mydata1')
  await eventBus.emit('channel2', 'mydata2')
	t.deepEqual(channel1, [[1, 'mydata1'], [2, 'mydata1']])
	t.deepEqual(channel2, [[1, 'mydata2'], [2, 'mydata2']])
})

test('When an event is emmited the emisor can pull data from pullable subscribers', async t => {
  const eventBus = makeEventBus()
  const channel1 = []
  const channel2 = []
  eventBus.on('channel1', data => [1, data], true)
  eventBus.on('channel1', data => channel1.push([2, data]))
  eventBus.on('channel1', data => [3, data], true)
  eventBus.on('channel2', data => [1, data], true)
  eventBus.on('channel2', data => channel2.push([2, data]))
  eventBus.on('channel2', data => [3, data], true)
  const result1 = await eventBus.emit('channel1', 'mydata1')
  const result2 = await eventBus.emit('channel2', 'mydata2')
  // no pullable
  t.deepEqual(channel1, [[2, 'mydata1']])
  t.deepEqual(channel2, [[2, 'mydata2']])
  // pullable
	t.deepEqual(result1, [[1, 'mydata1'], [3, 'mydata1']])
	t.deepEqual(result2, [[1, 'mydata2'], [3, 'mydata2']])
})

test('A subscriber should be removed', async t => {
  const eventBus = makeEventBus()
  const channel1 = []
  const channel2 = []
  eventBus.on('channel1', data => channel1.push([1, data]))
  eventBus.on('channel1', data => channel1.push([2, data]))
  const sub = eventBus.on('channel2', data => channel2.push([1, data]))
  eventBus.on('channel2', data => channel2.push([2, data]))
  eventBus.off(sub)
  await eventBus.emit('channel1', 'mydata1')
  await eventBus.emit('channel2', 'mydata2')
	t.deepEqual(channel1, [[1, 'mydata1'], [2, 'mydata1']])
	t.deepEqual(channel2, [[2, 'mydata2']])
})
