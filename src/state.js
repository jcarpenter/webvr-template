var state = {
  app: '',
  window: {
    width: 0,
    height: 0,
  },
  keyboard: {
    open: false
  },
  instructions: {
    open: false
  },
  fov: {
    open: false
  },
  site: {
    open: true,
    loading: false,
    type: '',
    title: '',
    url: '',
    id: ''
  },
  voice: {
    open: false,
  },
  cinema: {
    open: false,
    content_type: 'none'
  },
  hud: {
    open: false,
  },
  omni: {
    open: false,
    url: 'hoverboard'
  },
  quad: {
    open: false,
  },
  bookmarks: {
    open: false
  }
}

module.exports = state;