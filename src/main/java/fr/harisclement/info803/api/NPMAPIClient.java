package fr.harisclement.info803.api;

import fr.harisclement.info803.exceptions.APINotFoundException;
import fr.harisclement.info803.utils.JsonReader;
import org.json.JSONObject;

public class NPMAPIClient {

    public static JSONObject searchAPI(String providedPackage) throws Exception {
        try {
            JSONObject jo = JsonReader.readJsonFromUrl("https://api.npms.io/v2/package/" + providedPackage);

            return jo.getJSONObject("collected").getJSONObject("metadata");
        }catch (Exception error){
            throw new APINotFoundException("Impossible de trouver la dépendence : " + providedPackage);
        }
    }

}
