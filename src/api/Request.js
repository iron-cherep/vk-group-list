import { VK_API_VERSION } from '../constants/API';
import * as requestTypes from '../constants/request-types';
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
        if (response.response) resolve(response.response);
        reject(response);
      });
    }), { weight: 1 });
  }

  /**
   * Общий метод для получения данных пользователей, инициализирующий
   * соответствующие методы в зависимости от типа запроса
   *
   * @returns {Promise<*>}
   */
  get(requestType, userFields, params) {
    switch (requestType) {
      case requestTypes.GET_BY_GROUP: {
        const { groupId } = params;
        if (!groupId) return Promise.reject(new Error('Не указан ID группы'));

        return this.getGroupList(groupId, userFields);
      }
      case requestTypes.GET_BY_JOB: {
        const { searchStrings } = params;
        if (!searchStrings) return Promise.reject(new Error('Не указана строка для поиска'));

        return this.getUsersByListOfJobs(searchStrings, userFields);
      }
      default:
        return null;
    }
  }

  /**
   * Метод для получения всей необходимой
   * информации о пользователях сообщества vk
   *
   * @param id
   * @param fields
   * @returns {Promise<*>}
   */
  async getGroupList(id, fields) {
    const users = await this.getGroupUsers(id);
    const usersInfo = await this.getUsersInfo(users.items, fields);
    const parsedUsers = usersInfo.map(await parseUserData);

    return Promise.all(parsedUsers);
  }

  async getUsersByListOfJobs(jobStrings, fields = null) {
    let fullList = [];
    const users = await Promise.all(jobStrings.map(string => this.getUsersByJob(string, fields)));

    users.forEach((current) => { fullList = [...fullList, ...current.items]; });

    const parsedUsers = fullList
      .filter((item, index, array) => array.indexOf(item) === index)
      .map(await parseUserData);

    return Promise.all(parsedUsers);
  }

  /**
   * Возвращает массив объектов пользователей, найденных по строке,
   * соответствующей указанному месту работы
   *
   * @param jobString - строка поиска по месту работы
   * @param fields - дополнительные поля, включаемые в объект
   * @returns {Promise<*>}
   */
  getUsersByJob(jobString, fields = null) {
    return this.request('users.search', { company: jobString, q: '', fields });
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
