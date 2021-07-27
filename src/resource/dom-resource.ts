import { documentOuterHTML } from "../package"
import { Resource } from "./resource"
import { HtmlLink } from "../extract-links/types"
import { GlobalConfig, UrlString } from "../types"
import { extractLinksFromDom } from "../extract-links"
import { blobToText } from "./util"

type DomResourceConfig = Pick<GlobalConfig, 'glob'>

export class DomResource extends Resource {
    private _url: UrlString | undefined
    private _doc: Document
    private _originalDoc: Document | null
    private _config: DomResourceConfig
    private _links: HtmlLink[]

    /**
     * @param url - Since the passed Document already has a property doc.URL, the url parameter is optional; if
     * passed it will override the value of doc.URL for determining the target of relative URLs.
     */
    constructor(url: UrlString | undefined, doc: Document, originalDoc: Document | null, config: DomResourceConfig)

    constructor(url: UrlString, html: string, originalDoc: Document | null, config: DomResourceConfig)

    constructor(url: UrlString | undefined, docOrHtml: Document | string, originalDoc: Document | null, config: DomResourceConfig) {
        super()
        const doc = (typeof docOrHtml === 'string')
            ? (new config.glob.DOMParser()).parseFromString(docOrHtml, 'text/html')
            : docOrHtml
        this._url = url
        this._doc = doc
        this._originalDoc = originalDoc
        this._config = config
        this._links = extractLinksFromDom(doc, { docUrl: url })
    }

    // Holds the Document object.
    get doc(): Document {
        return this._doc
    }

    get originalDoc(): Document | null {
        return this._originalDoc;
    }

    get url(): UrlString {
        return this._url ?? this._doc.URL
    }

    get blob(): Blob {
        return new this._config.glob.Blob([this.string], { type: 'text/html' })
    }

    // The DOM as a string (i.e. the document's outerHTML)
    get string(): string {
        // TODO Add <meta charset> if absent? Or html-encode characters as needed?
        return documentOuterHTML(this._doc)
    }

    get links(): HtmlLink[] {
        // TODO should we extract the links again, in case the document changed?
        return this._links
    }

    static async fromBlob({ url, blob, config }: {
        url: UrlString,
        blob: Blob,
        config: DomResourceConfig
    }): Promise<DomResource> { // Should be Promise<this>; see TS issue #5863
        const html = await blobToText(blob, config)
        return new this(url, html, null, config)
    }

    static clone({ url, doc, config }: {
        url?: UrlString,
        doc: Document,
        config: DomResourceConfig,
    }): DomResource { // Should be `this`; see TS issue #5863
        const clonedDoc = doc.cloneNode(/* deep = */ true) as Document
        // TODO Capture form input values (issue #19)
        // TODO Extract images from canvasses (issue #18)
        // etc..
        return new this(url, clonedDoc, doc, config)
    }
}
