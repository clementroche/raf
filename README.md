# raf

## Install

First install the npm package

```
npm install @clementroche/raf
```

Or with yarn

```
yarn add @clementroche/raf
```

## Usage

```javascript
import RAF from '@clementroche/raf'

const raf = new RAF(60)
raf.add(
  'rafID', // id
  function () {
    console.log('tick')
  }, // callback
  0 // index/priority
)

raf.remove('rafID')
```
