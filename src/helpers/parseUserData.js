import getAge from './getAge';
import api from '../api';

/**
 * Получает данные о последнем указанном месте работы
 * и возвращает простую строку или название и url группы,
 * если указана группа vk
 *
 * @param career
 * @returns {Promise<*>}
 */
async function parseCareer(career) {
  const lastJob = career.shift();

  if (lastJob && !!lastJob.group_id) {
    const vk = await api.init();
    const jobInfo = await vk.request.getGroupInfo(lastJob.group_id);

    return `${jobInfo[0].name} (ссылка: https://vk.com/${jobInfo[0].screen_name})`;
  } else if (lastJob && !!lastJob.company) {
    return lastJob.company;
  }

  return null;
}

/**
 * Возвращает данные из объекта api vk в необходимом формате
 *
 * @TODO: добавить UI для управления структурой возвращаемого объекта
 *
 * @param item
 * @returns {Promise<*>}
 */
async function parseUserData(item) {
  const result = {
    url: `https://vk.com/${item.domain}`,
    name: `${item.first_name} ${item.last_name}`,
    age: (item.bdate) ? (getAge(item.bdate) || '') : '',
    city: (item.city) ? item.city.title : '',
    university: (item.university) ? item.university_name : '',
    faculty: (item.faculty) ? item.faculty_name : '',
  };

  if (item.career && item.career.length > 0) result.job = await parseCareer(item.career);

  return result;
}

export default parseUserData;
