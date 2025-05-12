// store/index.js

export const state = () => ({
    deviceId: null,
  });
  
  export const mutations = {
    setDeviceId(state, deviceId) {
      state.deviceId = deviceId;
    },
  };
  
  export const getters = {
    getDeviceId(state) {
      return state.deviceId;
    },
  };
  