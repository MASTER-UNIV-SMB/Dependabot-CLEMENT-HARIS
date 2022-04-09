package fr.harisclement.info803.utils;

import java.util.regex.Pattern;

public class VersionCompare implements Comparable<VersionCompare> {

    private String version;

    public VersionCompare(String version) {
        if (version == null)
            throw new IllegalArgumentException("La version ne peut être null");

        Pattern p = Pattern.compile("[0-9]+(\\.[0-9]+)*");
        if (!version.matches(p.pattern()))
            throw new IllegalArgumentException("Le format de version est invalide");
        this.version = version;
    }

    public final String get() {
        return this.version;
    }

    @Override
    public int compareTo(VersionCompare that) {
        if (that == null)
            return 1;
        String[] thisParts = this.get().split("\\.");
        String[] thatParts = that.get().split("\\.");
        int length = Math.max(thisParts.length, thatParts.length);
        for (int i = 0; i < length; i++) {
            int thisPart = i < thisParts.length ?
                    Integer.parseInt(thisParts[i]) : 0;
            int thatPart = i < thatParts.length ?
                    Integer.parseInt(thatParts[i]) : 0;
            if (thisPart < thatPart)
                return -1;
            if (thisPart > thatPart)
                return 1;
        }
        return 0;
    }

    @Override
    public boolean equals(Object that) {
        if (this == that)
            return true;
        if (that == null)
            return false;
        if (this.getClass() != that.getClass())
            return false;
        return this.compareTo((VersionCompare) that) == 0;
    }

}
