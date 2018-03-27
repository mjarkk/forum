import test from 'ava';

test('connect to server', t => {
	t.pass()
})

for (let index = 0; index < 1000; index++) {
  test('test' + index, t => {
    t.pass()
  })
}