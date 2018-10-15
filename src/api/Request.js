import _ from 'lodash';
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
    console.log('users: ', users.length);

    const usersInfo = _.flatten(await this.getUsersInfo(users, fields));
    console.log(usersInfo);

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
  async getGroupUsers(id) {
    const requestOptions = { group_id: id, offset: 0 };
    let groupUsersNumber = 1;
    let receivedGroupUsers = [];

    while (requestOptions.offset < groupUsersNumber) {
      const response = await this.request('groups.getMembers', requestOptions); // eslint-disable-line no-await-in-loop

      // Задаём сдвиг меньше 1000, чтобы не потерять пользователей
      // при изменении списка участников сообщества во время выполнения запроса
      requestOptions.offset += 900;
      receivedGroupUsers = receivedGroupUsers.concat(response.items);
      groupUsersNumber = response.count;
    }

    // Возвращаем только уникальных пользователей
    return receivedGroupUsers.filter((user, index, array) => array.indexOf(user) === index);
  }

  /**
   * Возвращает массив объектов пользователей по id
   *
   * @param ids - массив id пользователей
   * @param fields - дополнительные поля, включаемые в объект
   * @returns {Promise<*>}
   */
  async getUsersInfo(ids, fields = null) {
    const requests = _.chunk(ids, 500).map(async currentChunk => this.request('users.get', { user_ids: currentChunk, fields }));

    return Promise.all(requests);
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
