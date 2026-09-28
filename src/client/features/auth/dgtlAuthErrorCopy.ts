export function getDgtlAuthErrorCopy(error: string | undefined) {
  if (error === "unable_to_link_account" || error === "account_not_linked") {
    return {
      title: "We couldn't connect your Service Hub account",
      description:
        "SEO could not safely match your account. Return to Service Hub and try again. If this repeats, contact support with the error code below. You do not need a separate SEO login.",
    };
  }
  return {
    title: "We couldn't open your SEO workspace",
    description:
      "Return to Service Hub and open SEO again. If this repeats, contact support with the error code below.",
  };
}
