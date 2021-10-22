/**
 * This is for those who wants to run build with webpack
 * The following lines are not required to run with webpack.
 *   <script src="assets/elements-x.js"></script> <!-- custom elements, enables <x-include> -->
 *   <script src="assets/chroma.min.js"></script> <!-- window.chroma-->
 *   <script src="assets/animate-x.js"></script> <!-- window.animate --
 * 
 * To build with webpack, run
 * 
 *   $ npm install -D @babel/core babel-loader clean-webpack-plugin copy-webpack-plugin \
 *     html-webpack-plugin http-server webpack webpack-cli webpack-dev-server
 *   $ webpack --config {{{out_dir}}}/webpack.config.js
 * 
 * To run webpack-dev-server with webpack
 * 
 *   $ webpack serve --config {{{out_dir}}}/webpack.config.js --mode=development --open
 */

 import 'elements-x';
 import {chroma} from 'chroma-js';
 import {animate} from 'animage-x';
 window.chroma = chroma;
 window.animate = animate;