export const config = {
  nEmbd: 384,
  nHead: 6,
  nLayer: 6,
  blockSize: 256,
  vocabSize: 65,
};

config.headSize = config.nEmbd / config.nHead;
config.ffHidden = 4 * config.nEmbd;
