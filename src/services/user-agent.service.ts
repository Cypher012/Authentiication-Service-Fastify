// services/user-agent.service.ts
import type { UAParser, IResult } from "ua-parser-js";

export class UserAgentService {
  private readonly parser: UAParser;
  ;

  constructor(ua: UAParser) {
    this.parser = ua;
  }
  
  parse() {
    const r: IResult = this.parser.getResult();
    let deviceType = "Desktop"
    if(r.device.type === "mobile") {
      deviceType = "Mobile"
    } else if(r.device.type === "tablet") {
      deviceType = "Tablet"
    }

    const deviceOS = r.os.name ?? null
    const deviceBrowser = r.browser.name ?? null

    return { deviceType, deviceOS, deviceBrowser };
  }
}
