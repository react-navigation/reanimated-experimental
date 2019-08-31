import { NativeModules } from 'react-native';

let isInBatch = false;
let batch = [];

const types = {
  CREATE: 0,
  DROP: 1,
  CONNECT: 2,
  DISCONNECT: 3,
  TO_VIEW: 4,
  FROM_VIEW: 5,
  ATTACH_EVENT: 6,
  DETACH_EVENT: 7,
};

// for OTA safety
const ReanimatedModule = NativeModules.ReanimatedModule.sendBatch
  ? {
      startBatch() {
        if (isInBatch) {
          return false;
        }
        isInBatch = true;
        return true;
      },
      endBatch() {
        NativeModules.ReanimatedModule.sendBatch(batch);
        batch = [];
        isInBatch = false;
      },
      ...NativeModules.ReanimatedModule,
      createNode(nodeID, config) {
        batch.push({
          nodeID,
          config,
          type: types.CREATE,
        });
      },
      dropNode(nodeID) {
        batch.push({
          nodeID,
          type: types.DROP,
        });
      },
      connectNodes(parentID, childID) {
        batch.push({
          parentID,
          childID,
          type: types.CONNECT,
        });
      },
      disconnectNodes(parentID, childID) {
        batch.push({
          parentID,
          childID,
          type: types.DISCONNECT,
        });
      },
      // ¯\_(ツ)_/¯¯
      // connectNodeToView(nodeID, viewTag) {
      //   batch.push({
      //     nodeID,
      //     viewTag,
      //     type: types.TO_VIEW,
      //   });
      // },
      disconnectNodeFromView(nodeID, viewTag) {
        batch.push({
          nodeID,
          viewTag,
          type: types.FROM_VIEW,
        });
      },
      // attachEvent(viewTag, eventName, nodeID) {
      //   batch.push({
      //     viewTag,
      //     eventName,
      //     nodeID,
      //     type: types.ATTACH_EVENT,
      //   })
      // },
      detachEvent(viewTag, eventName, nodeID) {
        batch.push({
          viewTag,
          eventName,
          nodeID,
          type: types.DETACH_EVENT,
        });
      },
    }
  : {
      startBatch() {
        return false;
      },
      ...NativeModules.ReanimatedModule,
    };

export default ReanimatedModule;
