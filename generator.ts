import { getJSessionIdAndLt, getJWHtml, getTicketedUrl } from "./utils.ts";

const studentId = Deno.args[0];
const password = Deno.args[1];

const { jSessionId, lt } = await getJSessionIdAndLt();
const ticketedUrl = await getTicketedUrl(jSessionId, lt, studentId, password);
if (!ticketedUrl)
  throw Error("Authentication Error, check your id and password");
await getJWHtml(ticketedUrl);

// url for schedule grasping is http://jw.hitsz.edu.cn/xszykb/queryxszykbzong