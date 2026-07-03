/** @jsxImportSource @webamboos/jsx-slack */
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
  Option,
  Section,
  Select,
  jsxslack,
} from "@webamboos/jsx-slack";

function print(label: string, json: unknown) {
  console.log(`== ${label} ==`);
  console.log(JSON.stringify(json, null, 2));
  console.log();
}

const count = 3;

print(
  "Message with JSX",
  JSXSlack(
    <Blocks>
      <Header>Hello from jsx-slack</Header>
      <Section>
        This is a <b>rich</b> message built with <i>JSX</i> and{" "}
        <code>@webamboos/jsx-slack</code>.
      </Section>
      <Divider />
      <Context>
        Status: all systems <b>operational</b>
      </Context>
    </Blocks>,
  ),
);

print(
  "Message with Actions",
  JSXSlack(
    <Blocks>
      <Section>
        Pick an item:
        <Image src="https://via.placeholder.com/16" alt="placeholder" />
      </Section>
      <Actions>
        <Button actionId="approve" style="primary">
          Approve
        </Button>
        <Button actionId="reject" style="danger">
          Reject
        </Button>
        <Button actionId="later">Later</Button>
      </Actions>
    </Blocks>,
  ),
);

print(
  "Message with Input",
  JSXSlack(
    <Blocks>
      <Input label="Pick a fruit">
        <Select actionId="fruit">
          <Option value="apple">Apple</Option>
          <Option value="banana">Banana</Option>
          <Option value="cherry">Cherry</Option>
        </Select>
      </Input>
    </Blocks>,
  ),
);

print(
  "Modal",
  JSXSlack(
    <Modal
      title="Tell us about yourself"
      submit="Save"
      close="Cancel"
      callbackId="profile_form"
    >
      <Input type="text" name="name" label="Name" placeholder="Your name" />
      <Input
        type="text"
        name="email"
        label="Email"
        placeholder="you@example.com"
      />
      <Input label="Role">
        <Select actionId="role">
          <Option value="dev">Developer</Option>
          <Option value="designer">Designer</Option>
          <Option value="pm">Product Manager</Option>
        </Select>
      </Input>
    </Modal>,
  ),
);

print(
  "Home",
  JSXSlack(
    <Home>
      <Section>
        :wave: Welcome to the <b>jsx-slack</b> demo app!
      </Section>
      <Divider />
      <Section>
        This demonstrates the App Home surface using{" "}
        <code>@webamboos/jsx-slack</code>.
      </Section>
      <Actions>
        <Button actionId="get_started" style="primary">
          Get Started
        </Button>
      </Actions>
    </Home>,
  ),
);

print(
  "Tagged template (jsxslack)",
  jsxslack`
    <Blocks>
      <Header>jsxslack template literal</Header>
      <Section>
        No transpiler needed! ${count} items in your queue.
      </Section>
      <Actions>
        ${[1, 2, 3].map(
          (i) => jsxslack`<Button actionId="item_${i}">Item ${i}</Button>`,
        )}
      </Actions>
    </Blocks>
  `,
);
