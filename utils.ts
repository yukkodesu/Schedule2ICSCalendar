const getJSessionIdAndLt = async function (): Promise<{
  jSessionId: string;
  lt: string;
}> {
  const data = await fetch(
    "https://sso.hitsz.edu.cn:7002/cas/login?service=http%3A%2F%2Fjw.hitsz.edu.cn%2Fcas"
  );
  const setCookie = data.headers.getSetCookie();
  const body = await data.text();
  const ltStartIdx = body.indexOf(`<input type="hidden" name="lt" value="`);
  const ltEndIdx = body.indexOf(`" />`, ltStartIdx);
  const lt = body.substring(ltStartIdx + 38, ltEndIdx);
  const jSessionId = setCookie[0].split(";").at(0)?.split("=").at(1);
  if (!jSessionId) throw Error("Can't get jSessionId");
  return { jSessionId, lt };
};

const getTicketedUrl = async function (
  jSessionId: string,
  lt: string,
  studentId: string,
  password: string
) {
  const data = await fetch(
    `https://sso.hitsz.edu.cn:7002/cas/login;jsessionid=${jSessionId}?service=http%3A%2F%2Fjw.hitsz.edu.cn%2Fcas`,
    {
      headers: {
        Cookie: `JSESSIONID=${jSessionId}; j_username=${studentId}`,
        Referer: `https://sso.hitsz.edu.cn:7002/cas/login?service=http%3A%2F%2Fjw.hitsz.edu.cn%2Fcas`,
      },
      body: new URLSearchParams({
        username: studentId,
        password: password,
        rememberMe: "on",
        lt: lt,
        execution: "e1s1",
        _eventId: "submit",
      }),
      method: "POST",
      redirect: "manual",
    }
  );
  const headers = data.headers;
  return headers.get("Location");
};

const getJWHtml = async (ticketedUrl: string) => {
  if (!ticketedUrl) throw Error("Authenticated Error, check your password");
  const data = await fetch(ticketedUrl, {
    headers: {
      Cookie: `route=f6f00dd7e6a047baaaf301133ff17dc8`,
    },
    redirect: "manual",
  });
  const setCookie = data.headers.getSetCookie();
  const jSessionId = setCookie[0].split(";").at(0)?.split("=").at(1);
  const req = await fetch("http://jw.hitsz.edu.cn/authentication/main", {
    headers: {
      Cookie: `JSESSIONID=${jSessionId}`,
    },
  });
  const html = await req.text();
  console.log(html);
};

export { getJSessionIdAndLt, getJWHtml, getTicketedUrl };
