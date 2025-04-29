import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/inview-observer.js',
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/inview-observer.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  plugins: [typescript()],
  external: [],
};
