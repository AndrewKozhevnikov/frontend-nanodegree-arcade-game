/**
 * Image loading & caching class
 */
class Resources {
    constructor() {
        this.cache = {};
        this.callbacks = [];
    }

    /**
     * Load image(s) from url or urls array
     *
     * @param urlOrArr url or array
     * @public
     */
    load(urlOrArr) {
        if (urlOrArr instanceof Array) {
            urlOrArr.forEach(url => this._load(url));
        } else {
            this._load(urlOrArr);
        }
    }

    /**
     * Load and cache image from url
     *
     * @param url
     * @returns image if it was cached
     * @private
     */
    _load(url) {
        if (this.cache[url]) {
            return this.cache[url];
        } else {
            let img = new Image();
            img.src = url;
            img.onload = () => {
                this.cache[url] = img;
                if (this.allImagesAreLoaded()) {
                    this.callbacks.forEach(callback => callback());
                }
            };

            // Set the initial cache value to false, this will change when
            // the image's onload event handler is called.
            // This value is used in #allImagesAreLoaded() method.
            this.cache[url] = false;
        }
    }

    /**
     * Get cached image
     *
     * @param url
     * @returns image
     */
    get(url) {
        return this.cache[url];
    }

    /**
     * Check if all requested for loading images have been loaded
     *
     * @returns {boolean}
     */
    allImagesAreLoaded() {
        let result = true;
        for (let k in this.cache) {
            if (this.cache.hasOwnProperty(k) && !this.cache[k]) {
                result = false;
            }
        }
        return result;
    }

    /**
     * Add on images loaded callback function
     *
     * @param callback
     */
    addOnImagesLoadedCallback(callback) {
        this.callbacks.push(callback);
    }
}
