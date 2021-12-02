# vercel-canvas

![vercel-canvas](https://vercel-canvas.vercel.app/api/canvas?name=vercel-canvas)

vercel + canvas v2.8 setup

### prepare steps

1. add next `vercel-build` command to `package.json`

```json

  "scripts": {
    "vercel-build": "yum install libuuid-devel libmount-devel && cp /lib64/{libuuid,libmount,libblkid}.so.1 node_modules/canvas/build/Release/"
  }
```

2. add environment variable in project settings `LD_LIBRARY_PATH=/var/task/node_modules/canvas/build/Release:$LD_LIBRARY_PATH`

<img width="756" alt="Снимок экрана 2021-12-02 в 18 13 37" src="https://user-images.githubusercontent.com/6726016/144450031-dadf2b1b-9212-4a3f-a284-ef919c0ad283.png">

3. deploy and check that canvas works without errors

https://vercel-canvas.vercel.app/api/canvas?name=hehe
