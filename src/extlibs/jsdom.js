/**
 * Minified by jsDelivr using Terser v5.19.2.
 * Original file: /npm/jsdom@24.0.0/lib/api.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
"use strict";const path=require("path"),fs=require("fs").promises,vm=require("vm"),toughCookie=require("tough-cookie"),sniffHTMLEncoding=require("html-encoding-sniffer"),whatwgURL=require("whatwg-url"),whatwgEncoding=require("whatwg-encoding"),{URL:URL}=require("whatwg-url"),MIMEType=require("whatwg-mimetype"),idlUtils=require("./jsdom/living/generated/utils.js"),VirtualConsole=require("./jsdom/virtual-console.js"),{createWindow:createWindow}=require("./jsdom/browser/Window.js"),{parseIntoDocument:parseIntoDocument}=require("./jsdom/browser/parser"),{fragmentSerialization:fragmentSerialization}=require("./jsdom/living/domparsing/serialization.js"),ResourceLoader=require("./jsdom/browser/resources/resource-loader.js"),NoOpResourceLoader=require("./jsdom/browser/resources/no-op-resource-loader.js");class CookieJar extends toughCookie.CookieJar{constructor(e,o){super(e,{looseMode:!0,...o})}}const window=Symbol("window");let sharedFragmentDocument=null;class JSDOM{constructor(e="",o={}){const r=new MIMEType(void 0===o.contentType?"text/html":o.contentType),{html:n,encoding:t}=normalizeHTML(e,r);o=transformOptions(o,t,r),this[window]=createWindow(o.windowOptions);const i=idlUtils.implForWrapper(this[window]._document);o.beforeParse(this[window]._globalProxy),parseIntoDocument(n,i),i.close()}get window(){return this[window]._globalProxy}get virtualConsole(){return this[window]._virtualConsole}get cookieJar(){return idlUtils.implForWrapper(this[window]._document)._cookieJar}serialize(){return fragmentSerialization(idlUtils.implForWrapper(this[window]._document),{requireWellFormed:!1})}nodeLocation(e){if(!idlUtils.implForWrapper(this[window]._document)._parseOptions.sourceCodeLocationInfo)throw new Error("Location information was not saved for this jsdom. Use includeNodeLocations during creation.");return idlUtils.implForWrapper(e).sourceCodeLocation}getInternalVMContext(){if(!vm.isContext(this[window]))throw new TypeError("This jsdom was not configured to allow script running. Use the runScripts option during creation.");return this[window]}reconfigure(e){if("windowTop"in e&&(this[window]._top=e.windowTop),"url"in e){const o=idlUtils.implForWrapper(this[window]._document),r=whatwgURL.parseURL(e.url);if(null===r)throw new TypeError(`Could not parse "${e.url}" as a URL`);o._URL=r,o._origin=whatwgURL.serializeURLOrigin(o._URL),this[window]._sessionHistory.currentEntry.url=r}}static fragment(e=""){sharedFragmentDocument||(sharedFragmentDocument=(new JSDOM).window.document);const o=sharedFragmentDocument.createElement("template");return o.innerHTML=e,o.content}static fromURL(e,o={}){return Promise.resolve().then((()=>{const r=new URL(e),n=r.hash;r.hash="",e=r.href;const t=resourcesToResourceLoader((o=normalizeFromURLOptions(o)).resources),i=(t.constructor===NoOpResourceLoader?new ResourceLoader:t).fetch(e,{accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",cookieJar:o.cookieJar,referrer:o.referrer});return i.then((e=>{const r=i.response;return o=Object.assign(o,{url:i.href+n,contentType:r.headers["content-type"],referrer:i.getHeader("referer")??void 0}),new JSDOM(e,o)}))}))}static async fromFile(e,o={}){o=normalizeFromFileOptions(e,o);const r=await fs.readFile(e);return new JSDOM(r,o)}}function normalizeFromURLOptions(e){if(void 0!==e.url)throw new TypeError("Cannot supply a url option when using fromURL");if(void 0!==e.contentType)throw new TypeError("Cannot supply a contentType option when using fromURL");const o={...e};return void 0!==e.referrer&&(o.referrer=new URL(e.referrer).href),void 0===e.cookieJar&&(o.cookieJar=new CookieJar),o}function normalizeFromFileOptions(e,o){const r={...o};if(void 0===r.contentType){const o=path.extname(e);".xhtml"!==o&&".xht"!==o&&".xml"!==o||(r.contentType="application/xhtml+xml")}return void 0===r.url&&(r.url=new URL("file:"+path.resolve(e))),r}function transformOptions(e,o,r){const n={windowOptions:{url:"about:blank",referrer:"",contentType:"text/html",parsingMode:"html",parseOptions:{sourceCodeLocationInfo:!1,scriptingEnabled:!1},runScripts:void 0,encoding:o,pretendToBeVisual:!1,storageQuota:5e6,resourceLoader:void 0,virtualConsole:void 0,cookieJar:void 0},beforeParse(){}};if(!r.isHTML()&&!r.isXML())throw new RangeError(`The given content type of "${e.contentType}" was not a HTML or XML content type`);if(n.windowOptions.contentType=r.essence,n.windowOptions.parsingMode=r.isHTML()?"html":"xml",void 0!==e.url&&(n.windowOptions.url=new URL(e.url).href),void 0!==e.referrer&&(n.windowOptions.referrer=new URL(e.referrer).href),e.includeNodeLocations){if("xml"===n.windowOptions.parsingMode)throw new TypeError("Cannot set includeNodeLocations to true with an XML content type");n.windowOptions.parseOptions={sourceCodeLocationInfo:!0}}if(n.windowOptions.cookieJar=void 0===e.cookieJar?new CookieJar:e.cookieJar,n.windowOptions.virtualConsole=void 0===e.virtualConsole?(new VirtualConsole).sendTo(console):e.virtualConsole,!(n.windowOptions.virtualConsole instanceof VirtualConsole))throw new TypeError("virtualConsole must be an instance of VirtualConsole");if(n.windowOptions.resourceLoader=resourcesToResourceLoader(e.resources),void 0!==e.runScripts)if(n.windowOptions.runScripts=String(e.runScripts),"dangerously"===n.windowOptions.runScripts)n.windowOptions.parseOptions.scriptingEnabled=!0;else if("outside-only"!==n.windowOptions.runScripts)throw new RangeError('runScripts must be undefined, "dangerously", or "outside-only"');return void 0!==e.beforeParse&&(n.beforeParse=e.beforeParse),void 0!==e.pretendToBeVisual&&(n.windowOptions.pretendToBeVisual=Boolean(e.pretendToBeVisual)),void 0!==e.storageQuota&&(n.windowOptions.storageQuota=Number(e.storageQuota)),n}function normalizeHTML(e,o){let r="UTF-8";return ArrayBuffer.isView(e)?e=Buffer.from(e.buffer,e.byteOffset,e.byteLength):e instanceof ArrayBuffer&&(e=Buffer.from(e)),Buffer.isBuffer(e)?(r=sniffHTMLEncoding(e,{defaultEncoding:o.isXML()?"UTF-8":"windows-1252",transportLayerEncodingLabel:o.parameters.get("charset")}),e=whatwgEncoding.decode(e,r)):e=String(e),{html:e,encoding:r}}function resourcesToResourceLoader(e){switch(e){case void 0:return new NoOpResourceLoader;case"usable":return new ResourceLoader;default:if(!(e instanceof ResourceLoader))throw new TypeError("resources must be an instance of ResourceLoader");return e}}exports.JSDOM=JSDOM,exports.VirtualConsole=VirtualConsole,exports.CookieJar=CookieJar,exports.ResourceLoader=ResourceLoader,exports.toughCookie=toughCookie;
//# sourceMappingURL=/sm/a80fd870ee77dc28bebe1dcd4be49691c42682100b32ec8d4341801c74992232.map