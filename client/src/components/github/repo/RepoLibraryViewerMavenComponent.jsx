import React, { useEffect, useState } from 'react';
import { Badge, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Spinner, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import axios from 'axios';
import ToastUtils from '../../../utils/ToastUtils';
import StringUtils from '../../../utils/StringUtils';
import { Base64 } from 'js-base64';
import XMLParser from 'react-xml-parser';

export default function RepoLibraryViewerMavenComponent({ repo, isOpen, onClose }) {
  const [loading, setLoading] = useState(true);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [dependencies, setDependencies] = useState([]);
  const [packageJson, setPackageJson] = useState({});
  const [sha, setSHA] = useState('');

  useEffect(() => {
    _fetchAPI();
  }, []);

  const _fetchAPI = () => {
    setLoading(true);

    const token = localStorage.getItem('access_token');
    if (token === undefined) throw 'Aucun token github renseigné';

    axios
      .get('http://localhost:8080/api/v1/github/repositories/file?oauthToken=' + token + '&owner=' + repo.owner.login + '&repo=' + repo.name + '&file=pom.xml')
      .then((response) => {
        const { data } = response;
        if (data.error) {
          ToastUtils.showError(data.message);
          setLoading(false);
        } else {
          let dependencies = StringUtils.xmlDependenciesToArray(data.data.fileContent);

          let finalDependencies = [];

          dependencies.map((d) => {
            finalDependencies.push({
              ...d,
              hasUpdate: false,
              isLoading: true,
              isError: false,
            });
          });

          setSHA(data.data.sha);
          setDependencies(finalDependencies);
          setPackageJson(data.data.fileContent);
          setLoading(false);
          setNeedRefresh(true);
        }
      })
      .catch((error) => {
        ToastUtils.showError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    _fetchPackageUpdates();
  }, [needRefresh]);

  const _fetchPackageUpdates = () => {
    let promiseChecks = [];

    for (let i in dependencies) {
      promiseChecks.push(_apiPackageUpdate(dependencies[i]));
    }

    Promise.all(promiseChecks).then((values) => {
      console.log(values);
      setDependencies(values);
    });
  };

  const _apiPackageUpdate = (lib) => {
    return new Promise((resolve) => {
      axios
        .post('http://localhost:8080/api/v1/maven/verifyUpdate', {
          name: lib.groupId,
          version: lib.version,
        })
        .then((response) => {
          const { data } = response;

          let finalDependencies = undefined;

          dependencies.map((d) => {
            if (d.groupId == data.data.groupId) {
              finalDependencies = {
                ...d,
                nextVersion: data.data.nextVersion,
                isUpdateAvailable: data.data.isUpdateAvailable,
                isLoading: false,
                isError: false,
              };
            }
          });

          resolve(finalDependencies);
        })
        .catch((e) => resolve(lib));
    });
  };

  const _updatePackageJSON = () => {
    setLoading(true);

    let pomXMLFile = packageJson;

    dependencies.map((lib) => {
      if (lib.isUpdateAvailable) {
        pomXMLFile = pomXMLFile.replace('<version>' + lib.version + '</version>', '<version>' + lib.nextVersion + '</version>');
      }
    });

    const token = localStorage.getItem('access_token');
    if (token === undefined) throw 'Aucun token github renseigné';

    axios
      .put(
        'https://api.github.com/repos/' + repo.owner.login + '/' + repo.name + '/contents/pom.xml',
        {
          content: Base64.encode(pomXMLFile),
          message: 'Dependabot - Update pom.xml',
          sha,
        },
        { headers: { Authorization: 'token ' + token } }
      )
      .then((response) => {
        setLoading(false);
        window.open(response.data.commit.html_url, '_blank');
      })
      .catch((e) => ToastUtils.showError("Une erreur s'est produite !"));
  };

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} isFullHeight>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{repo.name}</DrawerHeader>

        <DrawerBody>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Spinner />
            </div>
          ) : (
            <TableContainer>
              <Table variant="simple">
                <TableCaption>Liste de vos dépendances</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Librairie</Th>
                    <Th isNumeric>Version</Th>
                    <Th isNumeric>Mise à jour</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dependencies.map((d, i) => (
                    <Tr key={d.groupId}>
                      <Td>{d.groupId}</Td>
                      <Td isNumeric>{d.version}</Td>
                      <Td isNumeric>{d.isLoading ? <Spinner size={'sm'} /> : d.isError ? <Badge colorScheme="red">Erreur</Badge> : d.isUpdateAvailable ? <Badge colorScheme="green">{d.nextVersion}</Badge> : <Badge colorScheme="red">Non</Badge>}</Td>
                    </Tr>
                  ))}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>Librairie</Th>
                    <Th isNumeric>Version</Th>
                    <Th isNumeric>Mise à jour</Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
          )}
        </DrawerBody>
        <DrawerFooter>
          {!loading && (
            <Button colorScheme={'green'} onClick={() => _updatePackageJSON()}>
              Mettre à jour les dépendances
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
