package fr.harisclement.info803.api;

import fr.harisclement.info803.exceptions.APINotFoundException;
import fr.harisclement.info803.utils.JsonReader;
import org.json.JSONObject;

public class MavenCentralAPIClient {

    public static JSONObject searchAPI(String artifactId) throws Exception {
        try {
            JSONObject jo = JsonReader.readJsonFromUrl("https://search.maven.org/solrsearch/select?q=g:" + artifactId + "&rows=5&wt=json");

            return jo.getJSONObject("response").getJSONArray("docs").getJSONObject(0);
        }catch (Exception error){
            throw new APINotFoundException("Impossible de trouver la dépendence : " + artifactId);
        }
    }

}
