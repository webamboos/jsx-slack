/** @jsxImportSource @webamboos/jsx-slack */
import { beforeEach, describe, expect, it } from "vitest";
import {
  Actions,
  Blocks,
  Button,
  Context,
  Divider,
  Header,
  Home,
  Image,
  Input,
  JSXSlack,
  Modal,
  Mrkdwn,
  Option,
  Section,
  Select,
  jsxslack,
} from "@webamboos/jsx-slack";

beforeEach(() => JSXSlack.exactMode(false));

describe("@webamboos/jsx-slack integration", () => {
  describe("message blocks", () => {
    it("builds a simple message with a section", () => {
      const blocks = JSXSlack(
        <Blocks>
          <Section>Hello, world!</Section>
        </Blocks>,
      );

      expect(blocks).toStrictEqual([
        {
          type: "section",
          text: { type: "mrkdwn", text: "Hello, world!", verbatim: true },
        },
      ]);
    });

    it("builds a message with multiple blocks", () => {
      const blocks = JSXSlack(
        <Blocks>
          <Header>Title</Header>
          <Section>
            Body text with <b>bold</b> and <i>italic</i>
          </Section>
          <Divider />
          <Context>
            <span>Footer text</span>{" "}
            <span>
              Author: <b>User</b>
            </span>
          </Context>
        </Blocks>,
      );

      expect(blocks).toHaveLength(4);
      expect(blocks[0].type).toBe("header");
      expect(blocks[1].type).toBe("section");
      expect(blocks[2].type).toBe("divider");
      expect(blocks[3].type).toBe("context");
    });

    it("builds a message with actions and a button", () => {
      const blocks = JSXSlack(
        <Blocks>
          <Section>Choose an action:</Section>
          <Actions>
            <Button actionId="approve" style="primary" value="ok">
              Approve
            </Button>
            <Button actionId="reject" style="danger" value="no">
              Reject
            </Button>
          </Actions>
        </Blocks>,
      );

      expect(blocks).toHaveLength(2);
      const actions = blocks[1] as any;
      expect(actions.type).toBe("actions");
      expect(actions.elements).toHaveLength(2);
      expect(actions.elements[0].action_id).toBe("approve");
      expect(actions.elements[0].style).toBe("primary");
      expect(actions.elements[1].action_id).toBe("reject");
      expect(actions.elements[1].style).toBe("danger");
    });

    it("builds a section with an image accessory", () => {
      const blocks = JSXSlack(
        <Blocks>
          <Section>
            Check out this image
            <Image src="https://example.com/img.png" alt="example" />
          </Section>
        </Blocks>,
      );

      expect(blocks).toHaveLength(1);
      const section = blocks[0] as any;
      expect(section.type).toBe("section");
      expect(section.accessory.type).toBe("image");
      expect(section.accessory.image_url).toBe("https://example.com/img.png");
      expect(section.accessory.alt_text).toBe("example");
    });

    it("supports input blocks with selects", () => {
      const blocks = JSXSlack(
        <Blocks>
          <Input label="Pick one">
            <Select actionId="choice">
              <Option value="a">Option A</Option>
              <Option value="b">Option B</Option>
              <Option value="c">Option C</Option>
            </Select>
          </Input>
        </Blocks>,
      );

      expect(blocks).toHaveLength(1);
      const input = blocks[0] as any;
      expect(input.type).toBe("input");
      expect(input.label.type).toBe("plain_text");
      expect(input.label.text).toBe("Pick one");
      expect(input.element.type).toBe("static_select");
      expect(input.element.action_id).toBe("choice");
      expect(input.element.options).toHaveLength(3);
    });
  });

  describe("modal views", () => {
    it("generates a modal view payload", () => {
      const view = JSXSlack(
        <Modal title="My Modal">
          <Section>Hello from the modal!</Section>
        </Modal>,
      );

      expect(view).toMatchObject({
        type: "modal",
        title: { type: "plain_text", text: "My Modal", emoji: true },
        blocks: [{ type: "section" }],
      });
    });

    it("supports optional modal attributes", () => {
      const view = JSXSlack(
        <Modal
          title="Form"
          submit="Submit"
          close="Cancel"
          callbackId="my_form"
          clearOnClose
          notifyOnClose={false}
          privateMetadata="meta"
          externalId="ext-1"
        >
          <Section>Fill in the form</Section>
        </Modal>,
      );

      expect(view).toMatchObject({
        type: "modal",
        title: { type: "plain_text", text: "Form", emoji: true },
        submit: { type: "plain_text", text: "Submit", emoji: true },
        close: { type: "plain_text", text: "Cancel", emoji: true },
        callback_id: "my_form",
        clear_on_close: true,
        notify_on_close: false,
        private_metadata: "meta",
        external_id: "ext-1",
      });
    });
  });

  describe("home views", () => {
    it("generates a home view payload", () => {
      const view = JSXSlack(
        <Home>
          <Section>Welcome to the App Home!</Section>
        </Home>,
      );

      expect(view).toMatchObject({
        type: "home",
        blocks: [{ type: "section" }],
      });
    });
  });

  describe("mrkdwn formatting", () => {
    it("renders bold, italic, and strikethrough", () => {
      const blocks = JSXSlack(
        <Blocks>
          <Section>
            <b>bold</b> <i>italic</i> <s>strikethrough</s>
          </Section>
        </Blocks>,
      );

      const text = (blocks[0] as any).text.text as string;
      expect(text).toContain("*bold*");
      expect(text).toContain("_italic_");
      expect(text).toContain("~strikethrough~");
    });

    it("renders inline code and links", () => {
      const blocks = JSXSlack(
        <Blocks>
          <Section>
            Use <code>npm install</code> to get started.{"\n"}
            Visit <a href="https://example.com">our site</a> for more info.
          </Section>
        </Blocks>,
      );

      const text = (blocks[0] as any).text.text as string;
      expect(text).toContain("`npm install`");
      expect(text).toContain("<https://example.com|our site>");
    });

    it("renders channel mentions and user mentions", () => {
      const blocks = JSXSlack(
        <Blocks>
          <Section>
            Ask in <a href="#C12345">#general</a> or ping{" "}
            <a href="@U67890">@user</a>
          </Section>
        </Blocks>,
      );

      const text = (blocks[0] as any).text.text as string;
      expect(text).toContain("<#C12345|");
      expect(text).toContain("<@U67890|");
    });

    it("renders special mentions", () => {
      const blocks = JSXSlack(
        <Blocks>
          <Section>
            Hey <a href="@here">@here</a> and <a href="@channel">@channel</a>
          </Section>
        </Blocks>,
      );

      const text = (blocks[0] as any).text.text as string;
      expect(text).toContain("<!here|");
      expect(text).toContain("<!channel|");
    });

    it("renders line breaks", () => {
      const blocks = JSXSlack(
        <Blocks>
          <Section>
            Line one
            <br />
            Line two
          </Section>
        </Blocks>,
      );

      const text = (blocks[0] as any).text.text as string;
      expect(text).toContain("\n");
    });

    it("renders lists with <ul> and <li>", () => {
      const blocks = JSXSlack(
        <Blocks>
          <Section>
            <ul>
              <li>First item</li>
              <li>Second item</li>
              <li>Third item</li>
            </ul>
          </Section>
        </Blocks>,
      );

      const text = (blocks[0] as any).text.text as string;
      expect(text).toContain("• First item");
      expect(text).toContain("• Second item");
      expect(text).toContain("• Third item");
    });
  });

  describe("exact mode", () => {
    it("inserts zero-width spaces around markup characters when enabled", () => {
      JSXSlack.exactMode(true);

      const blocks = JSXSlack(
        <Blocks>
          <Section>
            <b>bold</b> and <i>italic</i>
          </Section>
        </Blocks>,
      );

      const text = (blocks[0] as any).text.text as string;
      expect(text).toContain("\u200b");
      expect(text).toBe(
        "\u200b*\u200bbold\u200b*\u200b and \u200b_\u200bitalic\u200b_\u200b",
      );

      JSXSlack.exactMode(false);
    });

    it("does not insert zero-width spaces when disabled", () => {
      JSXSlack.exactMode(false);

      const blocks = JSXSlack(
        <Blocks>
          <Section>Plain text *without* changes</Section>
        </Blocks>,
      );

      const text = (blocks[0] as any).text.text as string;
      expect(text).toBe("Plain text *without* changes");
    });
  });

  describe("<Mrkdwn> component", () => {
    it("renders JSX children into mrkdwn text object", () => {
      const mrkdwn = JSXSlack(
        <Mrkdwn>
          Hello <b>bold</b> and <i>italic</i>
        </Mrkdwn>,
      );

      expect(mrkdwn).toMatchObject({
        type: "mrkdwn",
        text: expect.stringContaining("*bold*"),
      });
    });
  });

  describe("tagged template literal (jsxslack)", () => {
    it("produces the same output as JSX", () => {
      const name = "World";

      const viaTemplate = jsxslack`
        <Blocks>
          <Section>
            Hello, <b>${name}</b>!
          </Section>
        </Blocks>
      `;

      const viaJsx = JSXSlack(
        <Blocks>
          <Section>
            Hello, <b>{name}</b>!
          </Section>
        </Blocks>,
      );

      expect(viaTemplate).toStrictEqual(viaJsx);
    });

    it("supports fragments in templates", () => {
      const items = ["a", "b", "c"];

      const viaTemplate = jsxslack`
        <Blocks>
          <Actions>
            ${items.map(
              (item) =>
                jsxslack`<Button actionId=${item}>${item.toUpperCase()}</Button>`,
            )}
          </Actions>
        </Blocks>
      `;

      const result = JSXSlack(viaTemplate) as any[];
      expect(result[0].type).toBe("actions");
      expect(result[0].elements).toHaveLength(3);
      expect(result[0].elements[0].action_id).toBe("a");
      expect(result[0].elements[1].action_id).toBe("b");
      expect(result[0].elements[2].action_id).toBe("c");
    });
  });

  describe("HTML alias components", () => {
    it("supports <hr /> as alias for <Divider>", () => {
      const blocks = JSXSlack(
        <Blocks>
          <hr />
        </Blocks>,
      );

      expect(blocks[0].type).toBe("divider");
    });

    it("supports <img /> as alias for <Image>", () => {
      const blocks = JSXSlack(
        <Blocks>
          <Image src="https://example.com/pic.png" alt="A picture" />
        </Blocks>,
      );

      expect(blocks[0].type).toBe("image");
      expect((blocks[0] as any).image_url).toBe("https://example.com/pic.png");
      expect((blocks[0] as any).alt_text).toBe("A picture");
    });

    it("supports <section> as alias for <Section>", () => {
      const blocks = JSXSlack(
        <Blocks>
          <section>Text content</section>
        </Blocks>,
      );

      expect(blocks[0].type).toBe("section");
    });

    it("supports <button> as alias for <Button>", () => {
      const blocks = JSXSlack(
        <Blocks>
          <Actions>
            <button actionId="click_me">Click</button>
          </Actions>
        </Blocks>,
      );

      const actions = blocks[0] as any;
      expect(actions.elements[0].type).toBe("button");
      expect(actions.elements[0].text.text).toBe("Click");
    });
  });

  describe("JSXSlack namespace", () => {
    it("JSXSlack() acts as a noop cast for typed elements", () => {
      const element = <Section>test</Section>;
      expect(JSXSlack(element)).toStrictEqual(element);
    });

    it("JSXSlack.isValidElement detects valid elements", () => {
      const element = <Section>test</Section>;
      expect(JSXSlack.isValidElement(element)).toBe(true);
      expect(JSXSlack.isValidElement({ type: "section" })).toBe(false);
      expect(JSXSlack.isValidElement(null)).toBe(false);
    });
  });
});
