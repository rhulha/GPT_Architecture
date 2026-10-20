export const help = {
  "token indices": [
    "The input text, cut into tokens. In this model a token is a single character, and each character is represented by a number between 0 and 64, its index in the vocabulary.",
    "T is the number of tokens, at most 256. The model processes all T positions at the same time.",
  ],
  "token embedding": [
    "A lookup table that replaces each token index by a vector with 384 numbers, called its embedding.",
    "The numbers are learned during training. Characters that behave similarly end up with similar embeddings.",
  ],
  "position embedding": [
    "A second lookup table, indexed by position (0 to 255) instead of by character. It gives every position its own vector with 384 numbers.",
    "Attention has no sense of order by itself, so this is how the model knows which token comes first, second, third and so on.",
  ],
  "+ (add)": [
    "The token embedding and the position embedding are added number by number. The result says which character this is and where it sits in the text.",
    "This is the vector that flows into the first block.",
  ],
  "Block 1 to Block 6": [
    "One transformer block. The six blocks are identical in structure, but each has its own learned weights.",
    "Each block does two things: self-attention lets every token look at the tokens before it, and the feed-forward network then processes each token on its own.",
    "Each block reads the 384 numbers per token and returns 384 numbers per token, an improved version of the same vector. That is why the blocks can be stacked.",
    "Click a block to look inside.",
  ],
  "ln_f": [
    "The final LayerNorm. It rescales each token's 384 numbers to a standard range, with an average of 0 and a spread of 1, before the last step.",
    "This keeps the input to lm_head well behaved.",
  ],
  "lm_head": [
    "lm_head turns an embedding into a score for every token in the vocabulary, and the next token is then sampled from those scores.",
    "In other words: It outputs 65 numbers, one per character in the vocabulary.",
    "A higher number means that character is a more likely next token.",
  ],
  "logits": [
    "The raw scores that come out of lm_head: 65 numbers for each of the T positions.",
    "The scores at position t say which character is likely to come next after the first t+1 characters. Turning them into probabilities (softmax) and picking one is what generates text.",
    "During training the scores are compared with the real next character to measure the loss.",
  ],
  'LayerNorm': [
    "LayerNorm rescales each token's 384 numbers so that they have an average of 0 and a spread of 1, and then applies a learned scale and shift.",
    'It keeps the numbers flowing through the network in a stable range, which makes training much more stable.',
    'ln1 runs before attention and ln2 runs before the feed-forward network. Each block has its own pair.',
    'Click to see how it works.',
  ],
  'layernorm input': [
    'The input is a table with one row per token, and each row has 384 numbers.',
    'LayerNorm treats every row separately: the numbers of one token are never mixed with the numbers of another token.',
  ],
  'layernorm raw': [
    'The 384 numbers of one token before normalization. They can sit far from 0 and be spread out a lot.',
    'The dashed line is their average (μ). The shaded band shows their spread (σ, the standard deviation).',
  ],
  'layernorm normalized': [
    'Subtract the average μ from every number, then divide by the spread σ. Now the numbers are centred on 0 and have a spread of 1.',
    'The shape of the bars stays the same. Only their position and size changed.',
    'ε is a tiny constant that makes sure the model never divides by zero.',
  ],
  'layernorm gamma': [
    'γ (gamma) is a learned scale. Each of the 384 positions has its own number that stretches or shrinks the normalized value.',
    'It starts at 1, which means no change, and is adjusted during training.',
  ],
  'layernorm beta': [
    'β (beta) is a learned shift. Each of the 384 positions has its own number that is added after the scaling.',
    'It starts at 0, which means no change. Together, γ and β let the model undo the normalization wherever that helps.',
  ],
  'layernorm output': [
    'The result: the normalized numbers, scaled by γ and shifted by β.',
    'It has the same 384 numbers per token as the input, so LayerNorm can sit anywhere in the network without changing any shapes.',
  ],
  'FeedForward': [
    'The feed-forward network processes each token on its own, after attention has gathered information from the other tokens.',
    'It expands the 384 numbers to 1536, applies ReLU, and compresses them back to 384.',
    'Attention is where the tokens communicate. The feed-forward network is where each token computes with what it has gathered.',
    'Click to look inside.',
  ],
  'ffwd expand': [
    "The first Linear layer expands each token's 384 numbers to 1536, four times as many. The extra room lets the network compute many intermediate features at once.",
    'Click to see its weight matrix.',
  ],
  'ReLU': [
    'ReLU keeps every positive number as it is and replaces every negative number with 0.',
    'x = max(0, x)',
    'Without it, the two Linear layers would collapse into a single one. ReLU is the non-linearity that lets the network learn more complex patterns.',
  ],
  'ffwd shrink': [
    'The second Linear layer compresses the 1536 numbers back to 384.',
    'The output has the same size as the input, so it can be added back to the residual stream.',
    'Click to see its weight matrix.',
  ],
  'residual': [
    'The residual connection (also called skip connection) adds the input of a step directly to its output: x = x + step(x).',
    'So a step does not have to rebuild the whole vector. It only learns what to add to it, and the original information always flows through unchanged.',
    'It also lets the training signal flow straight through all 6 blocks, which makes deep networks much easier to train.',
    'Every block has two of them: one around attention and one around the feed-forward network.',
  ],
  'proj': [
    'proj mixes the results of the 6 heads. Each head produced 64 numbers, so after concatenation there are 384 numbers per token, and this Linear layer (384 → 384) combines them into one new vector.',
    'Without it, the heads would stay in separate slots of the vector and never interact.',
    'The output has the same size as the input, so it can be added back to the residual stream.',
    'Click to see its weight matrix.',
  ],
};
