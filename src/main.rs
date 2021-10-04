use chrono::offset::FixedOffset;
use chrono::Datelike;
use chrono::TimeZone;
use wasm_bindgen::{JsCast, JsValue};
use yew::prelude::*;

#[allow(unused_macros)]
macro_rules! log {
    ($($t:tt)*) => (web_sys::console::log_1(&format_args!($($t)*).to_string().into()))
}

enum Msg {}

struct App {
    weekstart: i64,
}

impl Component for App {
    type Message = Msg;
    type Properties = ();

    fn create(_props: Self::Properties, _link: ComponentLink<Self>) -> Self {
        let date = chrono::Local::now();
        let date = date.with_timezone(&chrono::offset::FixedOffset::east(2 * 3600));

        let mut weekstart = date.timestamp() - (date.timestamp() + 2 * 3600) % 86400;
        if date.weekday().number_from_monday() >= 6 {
            weekstart += 7 * 86400;
        }

        Self { weekstart }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {}
    }

    fn change(&mut self, _props: Self::Properties) -> ShouldRender {
        false
    }

    fn view(&self) -> Html {
        let mut days = Vec::new();
        for offset in 0..6 {
            let datetime =
                FixedOffset::west(2 * 3600).timestamp(self.weekstart + offset * 86400, 0);
            let day = datetime.day();
            let month = match datetime.month() {
                1 => "Janvier",
                2 => "Février",
                3 => "Mars",
                4 => "Avril",
                5 => "Mai",
                6 => "Juin",
                7 => "Juillet",
                8 => "Août",
                9 => "Septembre",
                10 => "Octobre",
                11 => "Novembre",
                12 => "Décembre",
                _ => unreachable!(),
            };

            days.push(html! {
                <div>
                    { format!("{} {}", day, month) }
                </div>
            });
        }

        html! {
            <main>
                { days }
            </main>
        }
    }
}

fn main() {
    console_error_panic_hook::set_once();
    yew::start_app::<App>();
}
