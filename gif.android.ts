import * as tnsGifModule from "./gif.common";
import * as dependencyObservable from "ui/core/dependency-observable";
import { PropertyMetadata } from "ui/core/proxy";

import * as fs from "file-system";
import * as http from "http";

global.moduleMerge(tnsGifModule, exports);

function onSrcPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var gif = <Gif>data.object;
    if (!gif.android) {
        return;
    }

    gif.src = data.newValue;
}

// register the setNativeValue callback
(<PropertyMetadata>tnsGifModule.GifCommon.srcProperty.metadata).onSetNativeValue = onSrcPropertyChanged;

export class Gif extends tnsGifModule.GifCommon {
    private _android: pl.droidsonroids.gif.GifImageView;
    private _drawable: pl.droidsonroids.gif.GifDrawable;

    constructor() {
        super();
    }

    get android(): pl.droidsonroids.gif.GifDrawable {
        return this._android;
    }

    public _createUI() {
        this._android = new pl.droidsonroids.gif.GifImageView(this._context);

        var _this = this;  // TS doesn't always know when to create _this

        if (this.src) {
            var isUrl = false;

            if (this.src.indexOf("://") !== -1) {
                if (this.src.indexOf('res://') === -1) {
                    isUrl = true;
                }
            }

            if (!isUrl) {
                var currentPath = fs.knownFolders.currentApp().path;

                if (this.src[1] === '/' && (this.src[0] === '.' || this.src[0] === '~')) {
                    this.src = this.src.substr(2);
                }

                if (this.src[0] !== '/') {
                    this.src = currentPath + '/' + this.src;
                }

                this._drawable = new pl.droidsonroids.gif.GifDrawable(this.src);
                this._android.setImageDrawable(this._drawable);

            } else {

                http.request({ url: this.src, method: "GET" }).then(function(r) {

                    _this._drawable = new pl.droidsonroids.gif.GifDrawable(r.content.raw.toByteArray());
                    _this._android.setImageDrawable(_this._drawable);
                    console.log('this._drawable: ' + this._drawable);

                }, function (err) {
                    console.log(err);
                });

            }
            
        } else {
            console.log("No src property set for the Gif");
        }

    }



    /**
     * Stop playing the .gif
     */
    public stop(): void {
      if (this._drawable)
        this._drawable.stop();
    }

    /**
     * Start playing the .gif
     */
    public start(): void {
      if (this._drawable)
        this._drawable.start();
    }

    /**
     * Check if the .gif is playing.
     * @returns  Boolean
     */
    public isPlaying(): boolean {
      if (this._drawable) {
        var isPlaying = this._drawable.isRunning();
        return isPlaying;
      } else {
        return false;
      }
    }

    /**
     * Get the frame count for a .gif.
     * @returns  Number of frames.
     */
    public getFrameCount(): number {
      if (this._drawable)
        var frames = this._drawable.getNumberOfFrames();
        return frames;
    }

    public reset(): void {
        this._drawable.reset();
    }

    public getDuration(): number {
      if (this._drawable) {
        var duration = this._drawable.getDuration();
        return duration;
      } else {
        return 0;
      }
    }

    public setSpeed(factor: number): void {
      if (this._drawable)
        this._drawable.setSpeed(factor);
    }

    public recycle(): void {
      if (this._drawable)
        this._drawable.recycle();
    }

}


    // var array = buffer.array();
                    // console.log('array: ' + array);

                    // var inputStream = java.io.InputStream.read(array);
                    // console.log('inputStream: ' + inputStream);