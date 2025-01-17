import { UrlString, Fetchy, FrameElement } from './util'

export * from './resource'
export * from './util'

export interface GlobalConfig {
    timeout: number,
    docUrl?: UrlString,
    charsetDeclaration: string | null,
    addMetadata: boolean,
    keepOriginalAttributes: boolean,
    now: Date,
    fetchResource?: Fetchy,
    getDocInFrame?: (frameElement: FrameElement) => Document | null, // TODO expose to user & test.
    glob: typeof window, /* global window */
}
