#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

precision mediump float;

varying float pic_mode;
varying vec4 fill;
varying vec4 stroke;
varying float point_size;
uniform float u_only_color;
uniform float u_color_picker_mode;
uniform sampler2D u_sprites;

float delta = 0.0, alpha = 1.0;


bool out_of_circle(in vec2 coord) {
  vec2 cxy = 2.0 * coord - 1.0;
  float r_sq = dot(cxy, cxy);
  if (r_sq > 1.03) {return true;}
  return false;
}

bool out_of_hollow_circle(in vec2 coord) {
  vec2 cxy = 2.0 * coord - 1.0;
  float r_sq = dot(cxy, cxy);
  if (r_sq > 1.01) {return true;}
  float distance_from_edge = (1.0 - r_sq) * point_size;
  if (distance_from_edge > 4.0) {return true;}
  return false;
}

bool out_of_triangle(in vec2 coord) {
  if (coord.y > (2. * abs(coord.x - .5))) {
    return false;
  }
  return true;
}

void main() {

  if (u_only_color >= -1.5) {
    gl_FragColor = vec4(0., 0., 0., 1./255.);
    return;
  }

    // Drop parts of the rectangle outside the unit circle.
    // I took this from observable.
    if (out_of_circle(gl_PointCoord)) {
      discard;
      return;
    }
    float alpha = fill.a;
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    #ifdef GL_OES_standard_derivatives
      delta = fwidth(r);
      alpha *= (1.0 - smoothstep(1.0 - delta, 1.0 + delta, r));
    #endif

    if (u_color_picker_mode > 0.5) {
      gl_FragColor = fill;
    } else {
      // Pre-blend the alpha channel.
      gl_FragColor = vec4(fill.rgb * alpha, alpha);
    }
}
