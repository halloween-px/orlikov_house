const parsedCounterId = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID);

export const METRIKA_COUNTER_ID =
  Number.isInteger(parsedCounterId) && parsedCounterId > 0
    ? parsedCounterId
    : 0;

export const siteGoals = {
  formSubmit: "site_form_submit",
  viewingRequest: "site_viewing_request",
  lotRequest: "site_lot_request",
  catalogDownload: "site_catalog_download",
  lotOpen: "site_lot_open",
  layoutView: "site_layout_view",
  phoneClick: "site_phone_click",
  messengerClick: "site_messenger_click",
} as const;
