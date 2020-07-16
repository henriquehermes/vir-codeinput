import React from "react";
import { storiesOf } from "@storybook/react";

import CodeInput from "../CodeInput";

storiesOf("CodeInput", module).add("Default", () => {
	return <CodeInput />;
});
