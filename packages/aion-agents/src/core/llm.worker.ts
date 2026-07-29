import { pipeline, env } from '@huggingface/transformers';

// Configurar entorno para Web Worker
env.allowLocalModels = false;
env.useBrowserCache = true;

let generator: any = null;
let isLoading = false;

self.onmessage = async (e: MessageEvent) => {
  const { type, id, messages, prompt } = e.data;

  if (type === 'INIT') {
    if (generator || isLoading) return;
    isLoading = true;
    try {
      // Cargar modelo neuronal SmolLM2-135M-Instruct en segundo plano
      generator = await pipeline(
        'text-generation',
        'HuggingFaceTB/SmolLM2-135M-Instruct',
        { dtype: 'q4' }
      );
      isLoading = false;
      self.postMessage({ type: 'INIT_DONE', success: true });
    } catch (err: any) {
      isLoading = false;
      self.postMessage({ type: 'INIT_DONE', success: false, error: err?.message || String(err) });
    }
    return;
  }

  if (type === 'GENERATE') {
    if (!generator) {
      try {
        generator = await pipeline(
          'text-generation',
          'HuggingFaceTB/SmolLM2-135M-Instruct',
          { dtype: 'q4' }
        );
      } catch (err: any) {
        self.postMessage({ id, type: 'ERROR', error: 'No se pudo cargar el modelo en worker' });
        return;
      }
    }

    try {
      const output = await generator(messages || prompt, {
        max_new_tokens: 150,
        temperature: 0.7,
        do_sample: true,
      });

      const rawText = output?.[0]?.generated_text;
      let textResult = '';

      if (Array.isArray(rawText)) {
        const last = rawText[rawText.length - 1];
        textResult = last?.content || '';
      } else if (typeof rawText === 'string') {
        textResult = rawText;
      }

      self.postMessage({ id, type: 'RESULT', text: textResult.trim() });
    } catch (err: any) {
      self.postMessage({ id, type: 'ERROR', error: err?.message || String(err) });
    }
  }
};
