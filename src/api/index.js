import PromiseThrottle from 'promise-throttle';
import xls from '../xls';
import getAge from '../helpers/getAge';

class Api {
  constructor() {
    this.queue = new PromiseThrottle({ requestsPerSecond: 2 });

    this.parseUserData = this.parseUserData.bind(this);
  }

  async init() {
    let status;

    try {
      const VK = await this.checkVKApi();
      const user = await this.login(VK);

      this.VK = VK;

      if (user) status = [true, 'Пользователь успешно авторизован!'];
      else status = [false, 'Ошибка авторизации'];
    } catch (e) {
      console.log(e);
    }

    return status;
  }

  checkVKApi() {
    if (window.VK) return window.VK;
    throw new Error('Ошибка: openapi.js не подключен на странице');
  }

  login(VK) {
    if (VK._userStatus !== 'connected') {
      return new Promise((resolve, reject) => {
        VK.Auth.login((response) => {
          if (response.session) {
            resolve(response.session.user);
          } else {
            reject(new Error('Ошибка авторизации'));
          }
        });
      });
    } else {
      return new Promise((resolve) => {
        resolve(true);
      });
    }
  }

  async getGroupList(id) {
    const userFields = ['bdate', 'city', 'photo_50', 'domain', 'education', 'career'];

    try {
      const users = await this.getGroupUsers(id);
      const usersInfo = await this.getUsersInfo(users.items, userFields);
      const parsedUsers = usersInfo
        .filter(item => !(typeof item === 'undefined' || item.deactivated))
        .map(await this.parseUserData);

      Promise.all(parsedUsers).then(console.log);
    } catch (e) {
      console.log(e);
    }
  }

  async request(action, options) {
    const optionsWithVersion = { ...options, v: '5.73' };

    return this.queue.add(() => {
      return new Promise((resolve, reject) => {
        this.VK.Api.call(action, optionsWithVersion, (response) => {
          if (response.response) return resolve(response.response);
          reject(response);
        });
      });
    }, { weight: 1 });
  }

  getGroupUsers(id) {
    return this.request('groups.getMembers', { group_id: id });
  }

  getUsersInfo(ids, fields = null) {
    return this.request('users.get', { user_ids: ids, fields });
  }

  getGroupInfo(id) {
    return this.request('groups.getById', { group_id: id });
  }

  async parseUserData(item) {
    const result = {
      url: `https://vk.com/${item.domain}`,
      name: `${item.first_name} ${item.last_name}`,
      age: (item.bdate) ? (getAge(item.bdate) || '') : '',
      city: (item.city) ? item.city.title : '',
      university: (item.university) ? item.university_name : '',
      faculty: (item.faculty) ? item.faculty_name : '',
    };

    if (item.career) {
      if (!!item.career[0] && !!item.career[0].group_id) {
        try {
          const jobInfo = await this.getGroupInfo(item.career[0].group_id);
          result.job = `${jobInfo[0].name} (ссылка: https://vk.com/${jobInfo[0].screen_name})`;
        } catch (e) {
          console.log(e);
        }
      } else if (!!item.career[0] && item.career[0].company) {
        result.job = item.career[0].company;
      }
    }

    return result;
  }
}

export default Api;
