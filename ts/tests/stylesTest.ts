import { assert, expect } from "chai";
import { Formatter } from "../export/formatter";
import { Styles } from "../styles";
import { ParagraphStyle, Style } from "../styles/style";
import * as components from "../styles/style/components";

describe("Styles", () => {
    let styles: Styles;

    beforeEach(() => {
        styles = new Styles();
    });

    describe("#constructor()", () => {
        it("should create styles with correct rootKey", () => {
            const newJson = JSON.parse(JSON.stringify(styles));
            assert.equal(newJson.rootKey, "w:styles");
        });
    });

    describe("#createParagraphStyle", () => {
        it("should create a new paragraph style and push it onto this collection", () => {
            const ps = styles.createParagraphStyle("pStyleId");
            const tree = new Formatter().format(styles)["w:styles"].filter((x) => !x._attr);
            expect(tree).to.deep.equal([{
                "w:style": [
                    {_attr: {"w:type": "paragraph", "w:styleId": "pStyleId"}},
                    {"w:pPr": []},
                    {"w:rPr": []},
                ],
            }]);
        });

        it("should set the paragraph name if given", () => {
            const ps = styles.createParagraphStyle("pStyleId", "Paragraph Style");
            const tree = new Formatter().format(styles)["w:styles"].filter((x) => !x._attr);
            expect(tree).to.deep.equal([{
                "w:style": [
                    {_attr: {"w:type": "paragraph", "w:styleId": "pStyleId"}},
                    {"w:name": [{_attr: {"w:val": "Paragraph Style"}}]},
                    {"w:pPr": []},
                    {"w:rPr": []},
                ],
            }]);
        });
    });
});

describe("Style", () => {
    describe("#constructor()", () => {
        it("should set the given properties", () => {
            const style = new Style({
                type: "paragraph",
                styleId: "myStyleId",
                default: true,
            });
            const tree = new Formatter().format(style);
            expect(tree).to.deep.equal({
                "w:style": [
                    {_attr: {"w:type": "paragraph", "w:styleId": "myStyleId", "w:default": true}},
                ],
            });
        });

        it("should set the name of the style, if given", () => {
            const style = new Style({
                type: "paragraph",
                styleId: "myStyleId",
            }, "Style Name");
            const tree = new Formatter().format(style);
            expect(tree).to.deep.equal({
                "w:style": [
                    {_attr: {"w:type": "paragraph", "w:styleId": "myStyleId"}},
                    {"w:name": [{_attr: {"w:val": "Style Name"}}]},
                ],
            });
        });
    });
});

describe("Style components", () => {
    it("Name#constructor", () => {
        const style = new components.Name("Style Name");
        const tree = new Formatter().format(style);
        expect(tree).to.deep.equal({"w:name": [{_attr: {"w:val": "Style Name"}}]});
    });

    it("BasedOn#constructor", () => {
        const style = new components.BasedOn("otherId");
        const tree = new Formatter().format(style);
        expect(tree).to.deep.equal({"w:basedOn": [{_attr: {"w:val": "otherId"}}]});
    });

    it("Next#constructor", () => {
        const style = new components.Next("otherId");
        const tree = new Formatter().format(style);
        expect(tree).to.deep.equal({"w:next": [{_attr: {"w:val": "otherId"}}]});
    });

    it("Link#constructor", () => {
        const style = new components.Link("otherId");
        const tree = new Formatter().format(style);
        expect(tree).to.deep.equal({"w:link": [{_attr: {"w:val": "otherId"}}]});
    });

    it("UiPriority#constructor", () => {
        const style = new components.UiPriority("123");
        const tree = new Formatter().format(style);
        expect(tree).to.deep.equal({"w:uiPriority": [{_attr: {"w:val": "123"}}]});
    });
});

describe("ParagraphStyle", () => {
    describe("#constructor", () => {
        it("should set the style type to paragraph and use the given style id", () => {
            const style = new ParagraphStyle("myStyleId");
            const tree = new Formatter().format(style);
            expect(tree).to.deep.equal({
                "w:style": [
                    {_attr: {"w:type": "paragraph", "w:styleId": "myStyleId"}},
                    {"w:pPr": []},
                    {"w:rPr": []},
                ],
            });
        });

        it("should set the name of the style, if given", () => {
            const style = new ParagraphStyle("myStyleId", "Style Name");
            const tree = new Formatter().format(style);
            expect(tree).to.deep.equal({
                "w:style": [
                    {_attr: {"w:type": "paragraph", "w:styleId": "myStyleId"}},
                    {"w:name": [{_attr: {"w:val": "Style Name"}}]},
                    {"w:pPr": []},
                    {"w:rPr": []},
                ],
            });
        });
    });

    describe("formatting methods: style attributes", () => {
        it("#basedOn", () => {
            const style = new ParagraphStyle("myStyleId")
                .basedOn("otherId");
            const tree = new Formatter().format(style);
            expect(tree).to.deep.equal({
                "w:style": [
                    {_attr: {"w:type": "paragraph", "w:styleId": "myStyleId"}},
                    {"w:pPr": []},
                    {"w:rPr": []},
                    {"w:basedOn": [{_attr: {"w:val": "otherId"}}]},
                ],
            });
        });

        it("#quickFormat", () => {
            const style = new ParagraphStyle("myStyleId")
                .quickFormat();
            const tree = new Formatter().format(style);
            expect(tree).to.deep.equal({
                "w:style": [
                    {_attr: {"w:type": "paragraph", "w:styleId": "myStyleId"}},
                    {"w:pPr": []},
                    {"w:rPr": []},
                    {"w:qFormat": []},
                ],
            });
        });

        it("#next", () => {
            const style = new ParagraphStyle("myStyleId")
                .next("otherId");
            const tree = new Formatter().format(style);
            expect(tree).to.deep.equal({
                "w:style": [
                    {_attr: {"w:type": "paragraph", "w:styleId": "myStyleId"}},
                    {"w:pPr": []},
                    {"w:rPr": []},
                    {"w:next": [{_attr: {"w:val": "otherId"}}]},
                ],
            });
        });
    });

    describe("formatting methods: paragraph properties", () => {
        it("#indent", () => {
            const style = new ParagraphStyle("myStyleId")
                .indent(720);
            const tree = new Formatter().format(style);
            expect(tree).to.deep.equal({
                "w:style": [
                    {_attr: {"w:type": "paragraph", "w:styleId": "myStyleId"}},
                    {"w:pPr": [
                        {"w:ind": [{_attr: {"w:left": 720}}]},
                    ]},
                    {"w:rPr": []},
                ],
            });
        });

        it("#spacing", () => {
            const style = new ParagraphStyle("myStyleId")
                .spacing({before: 50, after: 150});
            const tree = new Formatter().format(style);
            expect(tree).to.deep.equal({
                "w:style": [
                    {_attr: {"w:type": "paragraph", "w:styleId": "myStyleId"}},
                    {"w:pPr": [
                        {"w:spacing": [{_attr: {"w:before": 50, "w:after": 150}}]},
                    ]},
                    {"w:rPr": []},
                ],
            });
        });
    });

    describe("formatting methods: run properties", () => {
        it("#size", () => {
            const style = new ParagraphStyle("myStyleId")
                .size(24);
            const tree = new Formatter().format(style);
            expect(tree).to.deep.equal({
                "w:style": [
                    {_attr: {"w:type": "paragraph", "w:styleId": "myStyleId"}},
                    {"w:pPr": []},
                    {"w:rPr": [
                        {"w:sz": [{_attr: {"w:val": 24}}]},
                    ]},
                ],
            });
        });

        it("#bold", () => {
            const style = new ParagraphStyle("myStyleId")
                .bold();
            const tree = new Formatter().format(style);
            expect(tree).to.deep.equal({
                "w:style": [
                    {_attr: {"w:type": "paragraph", "w:styleId": "myStyleId"}},
                    {"w:pPr": []},
                    {"w:rPr": [
                        {"w:b": [{_attr: {"w:val": true}}]},
                    ]},
                ],
            });
        });

        it("#italics", () => {
            const style = new ParagraphStyle("myStyleId")
                .italics();
            const tree = new Formatter().format(style);
            expect(tree).to.deep.equal({
                "w:style": [
                    {_attr: {"w:type": "paragraph", "w:styleId": "myStyleId"}},
                    {"w:pPr": []},
                    {"w:rPr": [
                        {"w:i": [{_attr: {"w:val": true}}]},
                    ]},
                ],
            });
        });

        describe("#underline", () => {
            it("should set underline to 'single' if no arguments are given", () => {
                const style = new ParagraphStyle("myStyleId")
                    .underline();
                const tree = new Formatter().format(style);
                expect(tree).to.deep.equal({
                    "w:style": [
                        {_attr: {"w:type": "paragraph", "w:styleId": "myStyleId"}},
                        {"w:pPr": []},
                        {"w:rPr": [
                            {"w:u": [{_attr: {"w:val": "single"}}]},
                        ]},
                    ],
                });
            });

            it("should set the style if given", () => {
                const style = new ParagraphStyle("myStyleId")
                    .underline("double");
                const tree = new Formatter().format(style);
                expect(tree).to.deep.equal({
                    "w:style": [
                        {_attr: {"w:type": "paragraph", "w:styleId": "myStyleId"}},
                        {"w:pPr": []},
                        {"w:rPr": [
                            {"w:u": [{_attr: {"w:val": "double"}}]},
                        ]},
                    ],
                });
            });

            it("should set the style and color if given", () => {
                const style = new ParagraphStyle("myStyleId")
                    .underline("double", "005599");
                const tree = new Formatter().format(style);
                expect(tree).to.deep.equal({
                    "w:style": [
                        {_attr: {"w:type": "paragraph", "w:styleId": "myStyleId"}},
                        {"w:pPr": []},
                        {"w:rPr": [
                            {"w:u": [{_attr: {"w:val": "double", "w:color": "005599"}}]},
                        ]},
                    ],
                });
            });
        });

        it("#color", () => {
            const style = new ParagraphStyle("myStyleId")
                .color("123456");
            const tree = new Formatter().format(style);
            expect(tree).to.deep.equal({
                "w:style": [
                    {_attr: {"w:type": "paragraph", "w:styleId": "myStyleId"}},
                    {"w:pPr": []},
                    {"w:rPr": [
                        {"w:color": [{_attr: {"w:val": "123456"}}]},
                    ]},
                ],
            });
        });
    });
});
