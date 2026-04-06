export const SCENES = {
  'meridian-gate': {
    id: 'meridian-gate',
    name: '午门',
    // 使用可用的全景图片资源
    image: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/2294472375_24a3b8ef46_o.jpg',
    initYaw: 0,
    initPitch: 0,
    graphNodes: ['meridian-gate', 'hall-of-supreme-harmony'],
    hotspots: [
      {
        id: 'to-hall',
        type: 'navigate',
        label: '太和殿',
        position: { x: 1, y: 0, z: 0 },
        target: 'hall-of-supreme-harmony'
      },
      {
        id: 'gate-info',
        type: 'info',
        label: '午门介绍',
        position: { x: 0, y: 0.5, z: 1 },
        info: {
          title: '午门',
          year: '明永乐十八年（1420年）',
          desc: '午门是紫禁城的正门，也是故宫的正门。平面呈"凹"字形，上有崇楼五座，俗称"五凤楼"。午门是皇帝下诏书、下令出征的地方。',
          image: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800'
        }
      }
    ]
  },
  'hall-of-supreme-harmony': {
    id: 'hall-of-supreme-harmony',
    name: '太和殿',
    image: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/2294472375_24a3b8ef46_o.jpg',
    initYaw: 180,
    initPitch: 10,
    graphNodes: ['meridian-gate', 'hall-of-supreme-harmony', 'hall-of-central-harmony'],
    hotspots: [
      {
        id: 'to-meridian',
        type: 'navigate',
        label: '返回午门',
        position: { x: -1, y: 0, z: 0 },
        target: 'meridian-gate'
      },
      {
        id: 'to-central',
        type: 'navigate',
        label: '中和殿',
        position: { x: 1, y: 0, z: 0 },
        target: 'hall-of-central-harmony'
      },
      {
        id: 'hall-info',
        type: 'info',
        label: '太和殿介绍',
        position: { x: 0, y: 0.5, z: 1 },
        info: {
          title: '太和殿',
          year: '明永乐十八年（1420年）',
          desc: '太和殿，俗称"金銮殿"，是紫禁城内体量最大、等级最高的建筑。殿高35.05米，面积2377平方米。明清两代皇帝即位、大婚、册立皇后、命将出征等重大典礼都在此举行。',
          image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800'
        }
      }
    ]
  },
  'hall-of-central-harmony': {
    id: 'hall-of-central-harmony',
    name: '中和殿',
    image: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/2294472375_24a3b8ef46_o.jpg',
    initYaw: 0,
    initPitch: 0,
    graphNodes: ['hall-of-supreme-harmony', 'hall-of-central-harmony', 'hall-of-preserving-harmony'],
    hotspots: [
      {
        id: 'to-supreme',
        type: 'navigate',
        label: '太和殿',
        position: { x: -1, y: 0, z: 0 },
        target: 'hall-of-supreme-harmony'
      },
      {
        id: 'to-preserving',
        type: 'navigate',
        label: '保和殿',
        position: { x: 1, y: 0, z: 0 },
        target: 'hall-of-preserving-harmony'
      },
      {
        id: 'central-info',
        type: 'info',
        label: '中和殿介绍',
        position: { x: 0, y: 0.5, z: 1 },
        info: {
          title: '中和殿',
          year: '明永乐十八年（1420年）',
          desc: '中和殿位于太和殿后，是一座方形殿宇。皇帝在去太和殿之前先在此稍作休息，接受内阁大臣的跪拜礼仪。凡遇皇帝亲祭，如祭天坛、地坛，前一天要在此阅视祝文。',
          image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800'
        }
      }
    ]
  },
  'hall-of-preserving-harmony': {
    id: 'hall-of-preserving-harmony',
    name: '保和殿',
    image: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/2294472375_24a3b8ef46_o.jpg',
    initYaw: 180,
    initPitch: 5,
    graphNodes: ['hall-of-central-harmony', 'hall-of-preserving-harmony', 'imperial-garden'],
    hotspots: [
      {
        id: 'to-central',
        type: 'navigate',
        label: '中和殿',
        position: { x: -1, y: 0, z: 0 },
        target: 'hall-of-central-harmony'
      },
      {
        id: 'to-garden',
        type: 'navigate',
        label: '御花园',
        position: { x: 1, y: 0, z: 0 },
        target: 'imperial-garden'
      },
      {
        id: 'preserving-info',
        type: 'info',
        label: '保和殿介绍',
        position: { x: 0, y: 0.5, z: 1 },
        info: {
          title: '保和殿',
          year: '明永乐十八年（1420年）',
          desc: '保和殿是外朝三大殿的最后一座，也是外朝的终点。清朝时，每年除夕、正月十五，皇帝在此赐宴蒙古王公。乾隆后期，殿试也改在这里举行。',
          image: 'https://images.unsplash.com/photo-1528360983277-13d9b152c611?w=800'
        }
      }
    ]
  },
  'imperial-garden': {
    id: 'imperial-garden',
    name: '御花园',
    image: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/2294472375_24a3b8ef46_o.jpg',
    initYaw: 0,
    initPitch: 0,
    graphNodes: ['hall-of-preserving-harmony', 'imperial-garden'],
    hotspots: [
      {
        id: 'to-preserving',
        type: 'navigate',
        label: '返回保和殿',
        position: { x: -1, y: 0, z: 0 },
        target: 'hall-of-preserving-harmony'
      },
      {
        id: 'garden-info',
        type: 'info',
        label: '御花园介绍',
        position: { x: 0, y: 0.5, z: 1 },
        info: {
          title: '御花园',
          year: '明永乐十八年（1420年）',
          desc: '御花园位于紫禁城北端，是皇帝、皇后及嫔妃休闲游乐的场所。园内古柏老槐，奇石罗布，亭台楼阁，池馆水榭，点缀其间，幽美而恬静。',
          image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800'
        }
      }
    ]
  }
}