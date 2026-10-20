import { config as c } from './config.js';

const $ = (id) => document.getElementById(id);
const fmt = (n) => n.toLocaleString('en-US');

const countParams = ({ layers, embd, ff, context, vocab }) => {
  const block = 3 * embd * embd + embd * embd + embd + embd * ff + ff + ff * embd + embd + 4 * embd;
  return layers * block + vocab * embd + context * embd + 2 * embd + embd * vocab + vocab;
};

const mine = {
  layers: c.nLayer,
  heads: c.nHead,
  embd: c.nEmbd,
  head: c.headSize,
  ff: c.ffHidden,
  context: c.blockSize,
  vocab: c.vocabSize,
};
const mineParams = countParams(mine);

const columns = ['This model', 'GPT-1', 'GPT-2 small', 'GPT-2 XL', 'GPT-3'];

const rows = [
  ['Parameters', [`${fmt(mineParams)} (${(mineParams / 1e6).toFixed(1)}M)`, '117 million', '124 million', '1.5 billion', '175 billion']],
  ['Size compared to this model', ['1×', '≈ 11×', '≈ 11.5×', '≈ 140×', '≈ 16,000×']],
  ['Layers (blocks)', [mine.layers, 12, 12, 48, 96]],
  ['Attention heads per layer', [mine.heads, 12, 12, 25, 96]],
  ['Embedding size', [mine.embd, 768, 768, 1600, 12288]],
  ['Head size', [mine.head, 64, 64, 64, 128]],
  ['Feed-forward hidden size', [mine.ff, 3072, 3072, 6400, 49152]],
  ['Context length (tokens)', [mine.context, 512, 1024, 1024, 2048]],
  ['Vocabulary size', [mine.vocab, '≈ 40,000', '50,257', '50,257', '50,257']],
  ['A token is', ['one character', 'a sub-word (BPE)', 'a sub-word (BPE)', 'a sub-word (BPE)', 'a sub-word (BPE)']],
  ['Activation function', ['ReLU', 'GELU', 'GELU', 'GELU', 'GELU']],
  ['LayerNorm position', ['before each step', 'after each step', 'before each step', 'before each step', 'before each step']],
  ['Training data', ['Tiny Shakespeare, 1.1 million characters', 'BooksCorpus, about 7,000 books', 'WebText, about 8 million web pages (40 GB)', 'WebText, about 8 million web pages (40 GB)', 'about 300 billion tokens from web crawl, books and Wikipedia']],
];

$('compare').innerHTML =
  `<thead><tr><th></th>${columns.map((n, i) => `<th class="${i ? '' : 'mine'}">${n}</th>`).join('')}</tr></thead>` +
  `<tbody>${rows.map(([label, vals]) => `<tr><th>${label}</th>${vals.map((v, i) => `<td class="${i ? '' : 'mine'}">${typeof v === 'number' ? fmt(v) : v}</td>`).join('')}</tr>`).join('')}</tbody>`;

$('notes').innerHTML = [
  'GPT-2 and GPT-3 each come in several sizes. Shown are GPT-2 small, GPT-2 XL (the largest) and GPT-3 175B (the largest).',
  'The numbers for this model come from gpt.py. The others are from the original papers: Radford et al. 2018 (GPT-1), Radford et al. 2019 (GPT-2) and Brown et al. 2020 (GPT-3). Parameter counts are rounded.',
  'The structure is the same in all of them: token and position embeddings, a stack of blocks with attention and a feed-forward network, a final LayerNorm and a linear layer that outputs a score per token. Only the numbers differ.',
].map((t) => `<p>${t}</p>`).join('');
