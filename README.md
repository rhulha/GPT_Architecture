# GPT Visualizer

**See inside a GPT: zoom from the whole model down to a single attention head.**

An interactive diagram of the small GPT language model from Andrej Karpathy's video [Let's build GPT](https://www.youtube.com/watch?v=kCc8FmEb1nY) (6 layers, 6 heads, 384 embedding size, 65 characters). It is purely structural: no training, no animation, just the shapes and numbers.

## How to use it

Click a box to zoom in, use the breadcrumb at the top to zoom out.

- **GPT**: embeddings, the 6 blocks, final LayerNorm and `lm_head`
- **Block**: LayerNorm, attention, feed-forward and the two residual connections
- **MultiHeadAttention** and **FeedForward**
- **Head**: query, key and value matrices, the attention matrix and the output
- **Linear** and **LayerNorm**: the weight matrix as one pixel per weight, and a LayerNorm step by step

On desktop, hover over an element for a short explanation. On a phone, tap once for the explanation and tap again to zoom in.

There is also a page that [compares the numbers](compare.html) with GPT-1, GPT-2 and GPT-3.
