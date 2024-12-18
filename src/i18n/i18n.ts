import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import header_en from '../locales/en/header.json';
import header_vi from '../locales/vi/header.json';
import footer_en from '../locales/en/footer.json';
import footer_vi from '../locales/vi/footer.json';
import home_en from '../locales/en/home.json';
import home_vi from '../locales/vi/home.json';
import course_en from '../locales/en/course.json';
import course_vi from '../locales/vi/course.json';
import mylearn_en from '../locales/en/mylearn.json';
import mylearn_vi from '../locales/vi/mylearn.json';
import coursedetail_en from '../locales/en/coursedetail.json';
import coursedetail_vi from '../locales/vi/coursedetail.json';
import courseitem_en from '../locales/en/courseitem.json';
import courseitem_vi from '../locales/vi/courseitem.json';
import player_en from '../locales/en/player.json';
import player_vi from '../locales/vi/player.json';
import discuss_en from '../locales/en/discuss.json';
import discuss_vi from '../locales/vi/discuss.json';
import note_en from '../locales/en/note.json';
import note_vi from '../locales/vi/note.json';
import cart_en from '../locales/en/cart.json';
import cart_vi from '../locales/vi/cart.json';
import profile_en from '../locales/en/profile.json';
import profile_vi from '../locales/vi/profile.json';
import account_en from '../locales/en/account.json';
import account_vi from '../locales/vi/account.json';
import log_en from '../locales/en/log.json';
import log_vi from '../locales/vi/log.json';
import changepass_ev from '../locales/en/changepass.json';
import changepass_vi from '../locales/vi/changepass.json';

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
}

const resources = {
    en: {
      header: header_en,
      footer: footer_en,
      home: home_en,
      course: course_en,
      mylearn: mylearn_en,
      coursedetail: coursedetail_en,
      courseitem: courseitem_en,
      player: player_en,
      discuss: discuss_en,
      note: note_en,
      cart: cart_en,
      profile: profile_en,
      account: account_en,
      log: log_en,
      changepass: changepass_ev
    },
    vi: {
      header: header_vi,
      footer: footer_vi,
      home: home_vi,
      course: course_vi,
      mylearn: mylearn_vi,
      coursedetail: coursedetail_vi,
      courseitem: courseitem_vi,
      player: player_vi,
      discuss: discuss_vi,
      note: note_vi,
      cart: cart_vi,
      profile: profile_vi,
      account: account_vi,
      log: log_vi,
      changepass: changepass_vi
    },
  };

const defaultNS = 'home'

  i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    ns: ['header', 'footer', 'home', 'course', 'mylearn', 'coursedetail', 'courseitem', 'player', 'discuss', 'note', 'cart', 'profile', 'account', 'log', 'changepass'],
    fallbackLng: 'en',
    defaultNS,
    interpolation: {
      escapeValue: false,
    },
  });
  
  export default i18n;