import React, { useEffect, useState } from 'react';
import { Badge, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Spinner, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import axios from 'axios';
import ToastUtils from '../../../utils/ToastUtils';
import StringUtils from '../../../utils/StringUtils';
import { Base64 } from 'js-base64';

export default function RepoLibraryViewerComponent({ repo, isOpen, onClose }) {
  const [loading, setLoading] = useState(true);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [dependencies, setDependencies] = useState([]);
  const [packageJson, setPackageJson] = useState({});

  useEffect(() => {
    _fetchAPI();
  }, []);

  const _fetchAPI = () => {
    setLoading(true);

    const token = localStorage.getItem('access_token');
    if (token === undefined) throw 'Aucun token github renseigné';

    axios
      .get('http://localhost:8080/api/v1/github/repositories/file?oauthToken=' + token + '&owner=' + repo.owner.login + '&repo=' + repo.name + '&file=package.json')
      .then((response) => {
        const { data } = response;
        if (data.error) {
          ToastUtils.showError(data.message);
          setLoading(false);
        } else {
          let finalDependencies = [];

          Object.entries(data.data.fileContent.dependencies).map(([name, version]) => {
            let versionF = StringUtils.formatVersion(version);

            finalDependencies.push({
              name,
              version: versionF,
              hasUpdate: false,
              isLoading: true,
              isError: false,
            });
          });

          setDependencies(finalDependencies);
          setPackageJson(data.data);
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
        .post('http://localhost:8080/api/v1/npm/verifyUpdate', {
          name: lib.name,
          version: lib.version,
        })
        .then((response) => {
          const { data } = response;

          resolve(data.data);
        })
        .catch((e) => resolve(lib));
    });
  };

  const _updatePackageJSON = () => {
    setLoading(true);

    let packageJSONFinal = packageJson.fileContent;

    dependencies.map((lib) => {
      packageJSONFinal.dependencies[lib.name] = lib.isUpdateAvailable ? lib.nextVersion : lib.version;
    });

    let packageJSONString = JSON.stringify(packageJSONFinal, null, 2);

    const token = localStorage.getItem('access_token');
    if (token === undefined) throw 'Aucun token github renseigné';

    axios
      .put(
        'https://api.github.com/repos/' + repo.owner.login + '/' + repo.name + '/contents/package.json',
        {
          content: Base64.encode(packageJSONString),
          message: 'Dependabot - Update package.json',
          sha: packageJson.sha,
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
                    <Tr>
                      <Td>{d.name}</Td>
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
