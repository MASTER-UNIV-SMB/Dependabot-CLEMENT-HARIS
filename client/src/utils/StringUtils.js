import XMLParser from 'react-xml-parser';

export default class StringUtils {
  static formatVersion(s) {
    return s.replace(/[^\d.]/g, '');
  }

  static xmlDependenciesToArray(xml) {
    var xmlData = new XMLParser().parseFromString(xml);

    let dependencies = [];

    xmlData.getElementsByTagName('dependencyManagement')[0].children[0].children.map((d) => {
      let dependency = {};

      d.children.map((c) => {
        dependency[c.name] = c.value;
      });

      dependencies.push(dependency);
    });

    console.log(dependencies);

    return dependencies;
  }
}
