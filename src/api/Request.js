import { VK_API_VERSION } from '../constants/API';
import parseUserData from '../helpers/parseUserData';

class Request {
  constructor(VK, queue) {
    this.VK = VK;
    this.queue = queue;
  }

  /**
   * Фасад для обработки запросов к api vk, обеспечивающий
   * ограничение максимальной частоты запросов
   *
   * @param action
   * @param options
   * @returns {Promise<*>}
   */
  async request(action, options) {
    const optionsWithVersion = { ...options, v: VK_API_VERSION };

    return this.queue.add(() => new Promise((resolve, reject) => {
      this.VK.Api.call(action, optionsWithVersion, (response) => {
        if (response.response) return resolve(response.response);
        reject(response);
      });
    }), { weight: 1 });
  }

  /**
   * Общий метод для получения всей необходимой
   * информации о пользователях сообщества vk
   *
   * @param id
   * @param userFields
   * @returns {Promise<[any]>}
   */
  async getGroupList(id, userFields) {
    const users = await this.getGroupUsers(id);
    const usersInfo = await this.getUsersInfo(users.items, userFields);
    const parsedUsers = usersInfo
      .filter(item => !(typeof item === 'undefined' || item.deactivated))
      .map(await parseUserData);

    return Promise.all(parsedUsers);
  }

  /**
   * Возвращает объект с массивом id участников сообщества
   *
   * @param id - id сообщества
   * @returns {Promise<*>}
   */
  getGroupUsers(id) {
    return this.request('groups.getMembers', { group_id: id });
  }

  /**
   * Возвращает массив объектов пользователей по id
   *
   * @param ids - массив id пользователей
   * @param fields - дополнительные поля, включаемые в объект
   * @returns {Promise<*>}
   */
  getUsersInfo(ids, fields = null) {
    return this.request('users.get', { user_ids: ids, fields });
  }

  /**
   * Возвращает объект сообщества по id
   *
   * @param id - id сообщества
   * @returns {Promise<*>}
   */
  getGroupInfo(id) {
    return this.request('groups.getById', { group_id: id });
  }
}

export default Request;
