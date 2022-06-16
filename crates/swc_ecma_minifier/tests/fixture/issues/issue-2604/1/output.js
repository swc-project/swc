push({
    "": function() {
        function za() {
            try {
                return eval(a);
            } catch (b) {}
        }
        function Rb(a1) {
            return p() ? JSON : za();
        }
        h.get = function(a1) {
            return null == a1 ? null : Rb(a1);
        };
    },
    "App.jsx": function() {
        var ShaderChunk = {
            shadowmap_pars_vertex: "",
            shadowmap_vertex: "",
            shadowmask_pars_fragment: "",
            skinbase_vertex: "",
            skinning_pars_vertex: "",
            skinning_vertex: "",
            skinnormal_vertex: "",
            specularmap_fragment: "",
            specularmap_pars_fragment: "",
            tonemapping_fragment: "",
            tonemapping_pars_fragment: "",
            uv_pars_fragment: "",
            uv_pars_vertex: "",
            uv_vertex: "",
            uv2_pars_fragment: "",
            uv2_pars_vertex: "",
            uv2_vertex: "",
            worldpos_vertex: "",
            cube_frag: "",
            cube_vert: "",
            depth_frag: "",
            depth_vert: "",
            distanceRGBA_frag: "",
            distanceRGBA_vert: "",
            equirect_frag: "",
            equirect_vert: "",
            linedashed_frag: "",
            linedashed_vert: "",
            meshphong_frag: ""
        };
        ShaderLib.physical = {
            x: ShaderChunk.meshphysical_frag
        };
    }
});
