import * as esbuild from "https://deno.land/x/esbuild@v0.15.10/mod.js";
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.6.0/mod.ts";

const bg = await esbuild.build({
  plugins: [denoPlugin()],
  entryPoints: ["./src/background.ts"],
  outfile: "./release/background.js",
  bundle: true,
  //minify: true,
  platform: "browser",
  target: ["firefox107"],
});
console.log(bg.errors);

const window = await esbuild.build({
    plugins: [denoPlugin()],
    entryPoints: ["./src/mainWindowHandler.ts"],
    outfile: "./release/mainWindowHandler.js",
    bundle: true,
    //minify: true,
    platform: "browser",
    target: ["firefox107"]
  });
console.log(window.errors);

esbuild.stop();