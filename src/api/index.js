import PromiseThrottle from 'promise-throttle';

import { VK_API_REQUESTS_PER_SECOND } from '../constants/API';
import registerError from '../helpers/registerError';
import Request from './Request';

class Api {
  constructor() {
    this.initialized = false;
  }

  /**
   * Метод для инициализации api. Если аутентификация уже произведена при прошлых вызовах,
   * возвращает объект авторизованного api, иначе начинает процедуру аутентификации.
   *
   * @returns {Promise<Api>}
   */
  init() {
    return (this.initialized) ? Promise.resolve(this) : this.auth();
  }

  /**
   * Производит процедуру авторизации и возвращает инициализированный объект.
   *
   * @returns {Promise<Api>}
   */
  async auth() {
    try {
      this.VK = await Api.checkVKApi();
      this.user = await Api.login(this.VK);
      this.requestsQueue = new PromiseThrottle({ requestsPerSecond: VK_API_REQUESTS_PER_SECOND });
      this.request = new Request(this.VK, this.requestsQueue);

      this.initialized = true;
    } catch (error) {
      registerError({ category: 'Ошибка при инициализации api vk', error });
    }

    return this;
  }

  /**
   * Проверяет наличие объекта VK в глобальной области видимости.
   * Проверяет наличие объекта VK в глобальной области видимости.
   *
   * @returns {*}
   */
  static checkVKApi() {
    if (window.VK) return window.VK;
    throw new Error('Ошибка: openapi.js не подключен на странице.');
  }

  /**
   * Производит авторизацию пользователя.
   *
   * @param VK
   * @returns {Promise<*>}
   */
  static login(VK) {
    if (VK._userStatus === 'connected') { // eslint-disable-line no-underscore-dangle
      return Promise.resolve(this.user);
    }

    return new Promise((resolve, reject) => {
      VK.Auth.login((response) => {
        if (response.session) {
          resolve(response.session.user);
        } else {
          reject(new Error('Ошибка авторизации'));
        }
      });
    });
  }
}

const api = new Api();
export default api;
