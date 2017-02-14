/// <reference path="./demo/node_modules/tns-core-modules/tns-core-modules.d.ts" /> Needed for autocompletion and compilation.
/// <reference path="gif.d.ts" />

import definition = require("nativescript-gif");
import { View } from "ui/core/view";
import { PropertyMetadata } from "ui/core/proxy";
import * as dependencyObservable from "ui/core/dependency-observable";
import * as platform from "platform";
import * as types from "utils/types";

var SRC = "src";
var GIF = "Gif";
var ISLOADING = "isLoading";

// on Android we explicitly set propertySettings to None because android will invalidate its layout (skip unnecessary native call).
var AffectsLayout = platform.device.os === platform.platformNames.android ?
    dependencyObservable.PropertyMetadataSettings.None : dependencyObservable.PropertyMetadataSettings.AffectsLayout;

export class GifCommon extends View implements definition.Gif {

    public static srcProperty = new dependencyObservable.Property(SRC, GIF,
        new PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, GifCommon.onSrcPropertyChanged));

    public static isLoadingProperty = new dependencyObservable.Property(ISLOADING, GIF,
        new PropertyMetadata(false, dependencyObservable.PropertyMetadataSettings.None));

    constructor(options?: definition.Options) {
        super(options);
    }

    public static onSrcPropertyChanged = (data: dependencyObservable.PropertyChangeData) => {
        var gif = <GifCommon>data.object;
        var value = data.newValue;

        if (types.isString(value)) {
            value = value.trim();
            gif.src = value;
        }
    }

    get src(): any {
        return this._getValue(GifCommon.srcProperty);
    }
    set src(value: any) {
        this._setValue(GifCommon.srcProperty, value);
    }

    get isLoading(): boolean {
        return this._getValue(GifCommon.isLoadingProperty);
    }

}