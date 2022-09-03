import { createRoot } from "react-dom/client";
import React from "react";
import Map from "./map";

const container = document.getElementById("app");
const root = createRoot(container!);

root.render(<Map />);
